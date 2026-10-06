<?php

/**
 * Dependency-free regression tests for the Errorgap WordPress plugin.
 *
 * Runs on plain PHP (no WordPress, no PHPUnit): it shims the handful of
 * WordPress functions the reporting path uses, captures the payloads the
 * plugin would POST, and asserts on them. Run: `php tests/plugin_test.php`.
 */

define('ABSPATH', sys_get_temp_dir() . '/');
define('WP_CONTENT_DIR', __DIR__); // treat this test file as "app" code
define('ERRORGAP_ENDPOINT', 'http://127.0.0.1:9');
define('ERRORGAP_PROJECT_SLUG', 'demo');
define('ERRORGAP_ENVIRONMENT', 'production');
define('ERRORGAP_AUTH_EVENTS', true);

$GLOBALS['errorgap_captured'] = [];

function add_action(...$a) {}
function add_filter(...$a) {}
function register_activation_hook(...$a) {}
function apply_filters($tag, $value) { return $value; }
function plugin_basename($file) { return basename($file); }
function get_option($key, $default = false) { return $default; }
function home_url($path = '/') { return 'http://wp.test' . $path; }
function site_url() { return 'http://wp.test'; }
function get_bloginfo($key) { return '6.7'; }
function wp_get_environment_type() { return 'production'; }
function wp_get_current_user() { return new class { public $ID = 0; public function exists() { return false; } }; }
function sanitize_text_field($s) { return trim((string) $s); }
function sanitize_key($s) { return strtolower(preg_replace('/[^a-z0-9_\-]/', '', (string) $s)); }
function wp_unslash($s) { return $s; }
function wp_rand($a, $b) { return $a; }
function wp_json_encode($d) { return json_encode($d); }
function trailingslashit($s) { return rtrim($s, '/') . '/'; }
function esc_url_raw($s) { return $s; }
function sanitize_title($s) { return $s; }
function __($s, $d = null) { return $s; }
function esc_html__($s, $d = null) { return $s; }
function is_front_page() { return false; }
function is_home() { return false; }
function is_single() { return false; }
function is_page() { return false; }
function is_category() { return false; }
function is_tag() { return false; }
function is_author() { return false; }
function is_search() { return false; }
function is_404() { return false; }
function is_archive() { return false; }
function is_attachment() { return false; }
function is_admin() { return false; }
function wp_generate_uuid4() { return '0192f3c4-7a1b-4c2d-9e3f-0123456789ab'; }
function wp_parse_url($url, $component = -1) { return parse_url($url, $component); }
function wp_remote_post($url, $args) { $GLOBALS['errorgap_captured'][] = json_decode($args['body'], true); $GLOBALS['errorgap_urls'][] = $url; return []; }

require __DIR__ . '/../errorgap-wordpress.php';

$failures = 0;
function check(string $name, bool $ok): void
{
    global $failures;
    echo ($ok ? "PASS" : "FAIL") . " - $name\n";
    if (!$ok) {
        $failures++;
    }
}

$plugin = Errorgap_WordPress::instance();
$captured = static function (): array { return $GLOBALS['errorgap_captured']; };
$reset = static function (): void { $GLOBALS['errorgap_captured'] = []; };

// 1. A notice is below the default severity mask and must not be reported.
$reset();
$plugin->handle_error(E_USER_NOTICE, 'chatty notice', __FILE__, 10);
check('notice is not reported (severity mask)', count($captured()) === 0);

// 2. A warning is reported, with an in-app frame for wp-content code.
$reset();
$plugin->handle_error(E_USER_WARNING, 'gateway slow', __FILE__, 20);
$payload = $captured()[0] ?? null;
check('warning is reported', $payload !== null && $payload['errors'][0]['type'] === 'E_USER_WARNING');
check('warning frame is marked in_app', $payload !== null && ($payload['errors'][0]['backtrace'][0]['in_app'] ?? null) === true);

// 3. A nested exception reports context.causes and merges the cause's frames.
$reset();
try {
    try {
        throw new RuntimeException('orders database unreachable');
    } catch (Throwable $cause) {
        throw new LogicException('checkout failed', 0, $cause);
    }
} catch (Throwable $e) {
    try {
        $plugin->handle_exception($e);
    } catch (Throwable $rethrown) {
        // handle_exception rethrows when there is no previous handler.
    }
}
$payload = $captured()[0] ?? null;
check('exception is reported once', count($captured()) === 1);
check('root exception type is preserved', $payload !== null && $payload['errors'][0]['type'] === 'LogicException');
$causes = $payload['context']['causes'] ?? [];
check('cause chain is captured', count($causes) === 1 && $causes[0]['type'] === 'RuntimeException');
$messages = array_column($payload['errors'][0]['backtrace'], 'line');
check('cause frames are merged into the backtrace', count($payload['errors'][0]['backtrace']) >= 2);

// 4. Sensitive params are redacted (filter_input_array can't be driven from
//    CLI, so exercise the redaction logic directly).
$redact = new ReflectionMethod($plugin, 'redact');
$redact->setAccessible(true);
$out = $redact->invoke($plugin, ['password' => 'secret', 'api_token' => 'abc', 'run' => 'r1']);
check('password is redacted', ($out['password'] ?? '') === '[FILTERED]');
check('token is redacted', ($out['api_token'] ?? '') === '[FILTERED]');
check('non-sensitive param is kept', ($out['run'] ?? '') === 'r1');

// 5. The reported URL must not carry the query string (which can leak secrets).
$_SERVER['REQUEST_URI'] = '/checkout?password=super-secret&run=r1';
$_SERVER['REQUEST_METHOD'] = 'GET';
$build = new ReflectionMethod($plugin, 'build_payload');
$build->setAccessible(true);
$payload = $build->invoke($plugin, [
    'type' => 'X', 'message' => 'm', 'file' => __FILE__, 'line' => 1,
    'trace' => [], 'causes' => [], 'cause_traces' => [],
]);
$url = $payload['context']['url'] ?? '';
check('reported url drops the query string', strpos($url, '?') === false);
check('reported url does not leak secrets', strpos($url, 'super-secret') === false);

// 6. With APM on, errors carry the request's transaction id, and the
//    request's transaction is sent with the same id.
check('without a transaction, no transaction_id', !isset($payload['context']['transaction_id']));
$txProp = new ReflectionProperty($plugin, 'transaction_id');
$txProp->setAccessible(true);
$txProp->setValue($plugin, wp_generate_uuid4());
$payload = $build->invoke($plugin, [
    'type' => 'X', 'message' => 'm', 'file' => __FILE__, 'line' => 1,
    'trace' => [], 'causes' => [], 'cause_traces' => [],
]);
check('an error carries the request transaction id', ($payload['context']['transaction_id'] ?? null) === wp_generate_uuid4());
$startProp = new ReflectionProperty($plugin, 'request_start');
$startProp->setAccessible(true);
$startProp->setValue($plugin, microtime(true));
$reset();
$send = new ReflectionMethod($plugin, 'send_transaction');
$send->setAccessible(true);
$send->invoke($plugin, 12.5);
$sent = $captured()[0] ?? [];
check('the transaction is sent with the same id', ($sent['id'] ?? null) === wp_generate_uuid4());
check('without a browser trace header, no trace_id', !array_key_exists('trace_id', $sent));

// 7. The browser SDK's x-errorgap-trace header is recorded on the transaction.
$_SERVER['HTTP_X_ERRORGAP_TRACE'] = '0192F3C4-7A1B-4C2D-9E3F-0123456789AB';
$reset();
$send->invoke($plugin, 12.5);
$sent = $captured()[0] ?? [];
check('the browser trace id is recorded', ($sent['trace_id'] ?? null) === '0192f3c4-7a1b-4c2d-9e3f-0123456789ab');
$_SERVER['HTTP_X_ERRORGAP_TRACE'] = 'not-a-uuid';
$reset();
$send->invoke($plugin, 12.5);
$sent = $captured()[0] ?? [];
check('a malformed browser trace header is ignored', !array_key_exists('trace_id', $sent));
unset($_SERVER['HTTP_X_ERRORGAP_TRACE']);

// 8. Sign-ins (ERRORGAP_AUTH_EVENTS): wp_login, wp_login_failed and
//    after_password_reset post to /logins/web without the query string.
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/wp-login.php?redirect_to=%2Fwp-admin&reauth=1';
$_SERVER['REMOTE_ADDR'] = '203.0.113.140';
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 Chrome/129.0';
$_POST['pwd'] = 'hunter2';
$reset();
$GLOBALS['errorgap_urls'] = [];
$plugin->on_login_failed('admin');
$plugin->on_login('editor', null);
$plugin->on_password_reset((object) ['user_login' => 'editor']);
$events = array_map(fn($p) => $p['events'][0] ?? [], $captured());
check('three sign-ins are sent', count($events) === 3);
check('to /logins/web', ($GLOBALS['errorgap_urls'][0] ?? '') === 'http://127.0.0.1:9/api/projects/demo/logins/web');
check('outcomes are failure, success, password_reset', array_column($events, 'outcome') === ['failure', 'success', 'password_reset']);
check('the user names are sent', array_column($events, 'user') === ['admin', 'editor', 'editor']);
check('the path drops the query string', ($events[0]['path'] ?? '') === 'POST /wp-login.php');
check('ip and user agent are sent', ($events[0]['ip'] ?? '') === '203.0.113.140' && ($events[0]['user_agent'] ?? '') === 'Mozilla/5.0 Chrome/129.0');
check('the app is the site host', ($captured()[0]['app'] ?? '') === 'wp.test');
check('the password is never sent', strpos(json_encode($captured()), 'hunter2') === false);
$_SERVER['REMOTE_ADDR'] = 'not an ip';
$reset();
$plugin->on_login_failed('admin');
check('an invalid ip is dropped', !isset($captured()[0]['events'][0]['ip']));
unset($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI'], $_SERVER['REMOTE_ADDR'], $_SERVER['HTTP_USER_AGENT'], $_POST['pwd']);

echo "\n" . ($failures === 0 ? "All tests passed." : "$failures test(s) failed.") . "\n";
exit($failures === 0 ? 0 : 1);
