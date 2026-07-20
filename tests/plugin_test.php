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
function wp_remote_post($url, $args) { $GLOBALS['errorgap_captured'][] = json_decode($args['body'], true); return []; }

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

echo "\n" . ($failures === 0 ? "All tests passed." : "$failures test(s) failed.") . "\n";
exit($failures === 0 ? 0 : 1);
