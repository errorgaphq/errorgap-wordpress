<?php

/**
 * Plugin Name: Errorgap
 * Plugin URI: https://github.com/errorgaphq/errorgap-wordpress
 * Description: Reports WordPress PHP errors, exceptions, and shutdown fatals to Errorgap.
 * Version: 0.1.0
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author: Errorgap
 * Author URI: https://errorgap.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: errorgap
 *
 * @package ErrorgapWordPress
 */

if (!defined('ABSPATH')) {
  exit;
}

define('ERRORGAP_WP_VERSION', '0.1.0');
define('ERRORGAP_WP_OPTION', 'errorgap_wordpress_settings');

final class Errorgap_WordPress
{
  private static ?Errorgap_WordPress $instance = null;

  /** @var callable|null */
  private $previous_error_handler = null;

  /** @var callable|null */
  private $previous_exception_handler = null;

  /** @var array<string, bool> */
  private array $reported_errors = [];

  /** @var float|null */
  private ?float $request_start = null;

  public static function instance(): Errorgap_WordPress
  {
    if (self::$instance === null) {
      self::$instance = new self();
    }

    return self::$instance;
  }

  public static function activate(): void
  {
    add_option(ERRORGAP_WP_OPTION, self::default_settings());
  }

  public static function default_settings(): array
  {
    return [
      'enabled' => false,
      'endpoint' => '',
      'project_slug' => '',
      'project_key' => '',
      'environment' => '',
      'sample_rate' => 1.0,
      'apm_enabled' => false,
      'apm_db_queries' => false,
    ];
  }

  public function boot(): void
  {
    add_action('admin_menu', [$this, 'register_admin_menu']);
    add_action('admin_init', [$this, 'register_settings']);
    add_filter('plugin_action_links_' . plugin_basename(__FILE__), [$this, 'settings_link']);

    if (!$this->is_configured()) {
      return;
    }

    $this->previous_error_handler = set_error_handler([$this, 'handle_error']);
    $this->previous_exception_handler = set_exception_handler([$this, 'handle_exception']);
    register_shutdown_function([$this, 'handle_shutdown']);

    if ($this->apm_enabled()) {
      $this->request_start = microtime(true);
      add_action('init', [$this, 'apm_maybe_enable_savequeries'], 1);
    }
  }

  public function register_admin_menu(): void
  {
    add_options_page(
      __('Errorgap', 'errorgap'),
      __('Errorgap', 'errorgap'),
      'manage_options',
      'errorgap',
      [$this, 'render_settings_page']
    );
  }

  public function register_settings(): void
  {
    register_setting('errorgap', ERRORGAP_WP_OPTION, [
      'type' => 'array',
      'sanitize_callback' => [$this, 'sanitize_settings'],
      'default' => self::default_settings(),
    ]);

    add_settings_section(
      'errorgap_connection',
      __('Connection', 'errorgap'),
      '__return_false',
      'errorgap'
    );

    $fields = [
      'enabled' => __('Enabled', 'errorgap'),
      'endpoint' => __('Errorgap endpoint', 'errorgap'),
      'project_slug' => __('Project slug', 'errorgap'),
      'project_key' => __('Project key', 'errorgap'),
      'environment' => __('Environment', 'errorgap'),
      'sample_rate' => __('Sample rate', 'errorgap'),
      'apm_enabled' => __('APM enabled', 'errorgap'),
      'apm_db_queries' => __('APM DB queries', 'errorgap'),
    ];

    foreach ($fields as $field => $label) {
      add_settings_field(
        'errorgap_' . $field,
        $label,
        [$this, 'render_field'],
        'errorgap',
        'errorgap_connection',
        ['field' => $field]
      );
    }
  }

  public function settings_link(array $links): array
  {
    $url = admin_url('options-general.php?page=errorgap');
    array_unshift($links, '<a href="' . esc_url($url) . '">' . esc_html__('Settings', 'errorgap') . '</a>');

    return $links;
  }

  public function sanitize_settings($input): array
  {
    $input = is_array($input) ? $input : [];
    $settings = self::settings();

    $settings['enabled'] = !empty($input['enabled']);
    $settings['endpoint'] = isset($input['endpoint']) ? esc_url_raw(trim((string) $input['endpoint'])) : '';
    $settings['project_slug'] = isset($input['project_slug']) ? sanitize_title((string) $input['project_slug']) : '';
    $settings['project_key'] = isset($input['project_key']) ? sanitize_text_field((string) $input['project_key']) : '';
    $settings['environment'] = isset($input['environment']) ? sanitize_key((string) $input['environment']) : '';
    $settings['sample_rate'] = isset($input['sample_rate']) ? (float) $input['sample_rate'] : 1.0;
    $settings['sample_rate'] = max(0.0, min(1.0, $settings['sample_rate']));
    $settings['apm_enabled'] = !empty($input['apm_enabled']);
    $settings['apm_db_queries'] = !empty($input['apm_db_queries']);

    return $settings;
  }

  public function render_settings_page(): void
  {
    if (!current_user_can('manage_options')) {
      return;
    }
?>
    <div class="wrap">
      <h1><?php echo esc_html__('Errorgap', 'errorgap'); ?></h1>
      <form action="options.php" method="post">
        <?php
        settings_fields('errorgap');
        do_settings_sections('errorgap');
        submit_button();
        ?>
      </form>
    </div>
    <?php
  }

  public function render_field(array $args): void
  {
    $field = $args['field'];
    $settings = self::settings();
    $name = ERRORGAP_WP_OPTION . '[' . $field . ']';
    $value = $settings[$field] ?? '';

    if ($field === 'enabled') {
    ?>
      <label>
        <input type="checkbox" name="<?php echo esc_attr($name); ?>" value="1" <?php checked(!empty($value)); ?>>
        <?php echo esc_html__('Send WordPress errors to Errorgap', 'errorgap'); ?>
      </label>
    <?php
      return;
    }

    if ($field === 'apm_enabled') {
    ?>
      <label>
        <input type="checkbox" name="<?php echo esc_attr($name); ?>" value="1" <?php checked(!empty($value)); ?>>
        <?php echo esc_html__('Record request timing and send APM transactions', 'errorgap'); ?>
      </label>
    <?php
      return;
    }

    if ($field === 'apm_db_queries') {
    ?>
      <label>
        <input type="checkbox" name="<?php echo esc_attr($name); ?>" value="1" <?php checked(!empty($value)); ?>>
        <?php echo esc_html__('Include DB query spans (requires SAVEQUERIES)', 'errorgap'); ?>
      </label>
      <p class="description"><?php echo esc_html__('Add define(\'SAVEQUERIES\', true) to wp-config.php before enabling. Has a small per-query overhead.', 'errorgap'); ?></p>
    <?php
      return;
    }

    if ($field === 'project_key') {
    ?>
      <input class="regular-text" type="password" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr((string) $value); ?>" autocomplete="off">
      <p class="description"><?php echo esc_html__('Optional until your Errorgap notice endpoint enforces project keys.', 'errorgap'); ?></p>
    <?php
      return;
    }

    if ($field === 'sample_rate') {
    ?>
      <input class="small-text" type="number" min="0" max="1" step="0.01" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr((string) $value); ?>">
      <p class="description"><?php echo esc_html__('Use 1.0 to report every captured error.', 'errorgap'); ?></p>
    <?php
      return;
    }

    $type = $field === 'endpoint' ? 'url' : 'text';
    ?>
    <input class="regular-text" type="<?php echo esc_attr($type); ?>" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr((string) $value); ?>">
<?php
    if ($field === 'endpoint') {
      echo '<p class="description">' . esc_html__('Example: https://errorgap.example.com', 'errorgap') . '</p>';
    } elseif ($field === 'environment') {
      echo '<p class="description">' . esc_html__('Defaults to WP_ENVIRONMENT_TYPE, then production.', 'errorgap') . '</p>';
    }
  }

  public function apm_maybe_enable_savequeries(): void
  {
    if ($this->apm_db_queries_enabled() && !defined('SAVEQUERIES')) {
      // SAVEQUERIES must be defined before wpdb is instantiated; if it wasn't
      // set in wp-config.php we can still set the property directly on the
      // global wpdb object to capture queries from this point forward.
      global $wpdb;
      if (isset($wpdb)) {
        $wpdb->show_errors(false);
        $wpdb->save_queries = true;
      }
    }
  }

  public function handle_error(int $severity, string $message, string $file = '', int $line = 0): bool
  {
    if ((error_reporting() & $severity) !== 0) {
      $this->notify($this->error_payload([
        'type' => $this->php_error_type($severity),
        'message' => $message,
        'file' => $file,
        'line' => $line,
        'trace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS),
      ]));
    }

    if (is_callable($this->previous_error_handler)) {
      return (bool) call_user_func($this->previous_error_handler, $severity, $message, $file, $line);
    }

    return false;
  }

  public function handle_exception(Throwable $exception): void
  {
    $this->notify($this->error_payload([
      'type' => get_class($exception),
      'message' => $exception->getMessage(),
      'file' => $exception->getFile(),
      'line' => $exception->getLine(),
      'trace' => $exception->getTrace(),
    ]));

    if (is_callable($this->previous_exception_handler)) {
      call_user_func($this->previous_exception_handler, $exception);
      return;
    }

    throw $exception;
  }

  public function handle_shutdown(): void
  {
    $error = error_get_last();
    if (is_array($error) && $this->is_fatal_type((int) ($error['type'] ?? 0))) {
      $this->notify($this->fatal_error_payload([
        'type' => $this->php_error_type((int) $error['type']),
        'message' => (string) ($error['message'] ?? ''),
        'file' => (string) ($error['file'] ?? ''),
        'line' => (int) ($error['line'] ?? 0),
        'trace' => [],
      ]));
    }

    if ($this->apm_enabled() && $this->request_start !== null) {
      $duration_ms = (microtime(true) - $this->request_start) * 1000.0;
      $this->send_transaction($duration_ms);
    }
  }

  private function send_transaction(float $duration_ms): void
  {
    $settings = self::settings();
    $url = trailingslashit(rtrim((string) $settings['endpoint'], '/')) . 'api/projects/' . rawurlencode((string) $settings['project_slug']) . '/transactions';

    $method = isset($_SERVER['REQUEST_METHOD']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_METHOD'])) : 'GET';
    $path_raw = isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '/';
    $path_raw = strtok($path_raw, '?') ?: '/'; // strip query string

    $payload = [
      'kind' => 'web',
      'method' => $method,
      'path' => $this->wp_route_pattern(),
      'path_raw' => $path_raw,
      'status_code' => http_response_code() ?: 200,
      'duration_ms' => round($duration_ms, 2),
      'environment' => $this->environment_name(),
      'occurred_at' => gmdate('Y-m-d\TH:i:s.') . sprintf('%03d', (int) (fmod($this->request_start, 1) * 1000)) . 'Z',
      'spans' => $this->db_spans(),
    ];

    $headers = [
      'Content-Type' => 'application/json',
      'User-Agent' => 'errorgap-wordpress/' . ERRORGAP_WP_VERSION . '; ' . home_url('/'),
    ];

    if (!empty($settings['project_key'])) {
      $headers['X-Errorgap-Project-Key'] = (string) $settings['project_key'];
    }

    wp_remote_post($url, [
      'headers' => $headers,
      'body' => wp_json_encode($payload),
      'timeout' => 3,
      'blocking' => false,
    ]);
  }

  private function wp_route_pattern(): string
  {
    // WordPress has no URL router, so we map conditional tag functions to
    // synthetic route patterns that group pages by type rather than by ID.
    if (is_front_page()) return '/';
    if (is_home()) return '/blog';
    if (is_single()) return '/post/:id';
    if (is_page()) return '/page/:slug';
    if (is_category()) return '/category/:term';
    if (is_tag()) return '/tag/:term';
    if (is_author()) return '/author/:name';
    if (is_search()) return '/search';
    if (is_404()) return '/404';
    if (is_archive()) return '/archive/:type';
    if (is_attachment()) return '/attachment/:id';
    if (defined('DOING_AJAX') && DOING_AJAX) return '/wp-admin/ajax';
    if (defined('DOING_CRON') && DOING_CRON) return '/wp-cron';
    if (is_admin()) {
      $page = isset($_GET['page']) ? '/' . sanitize_key((string) $_GET['page']) : ''; // phpcs:ignore WordPress.Security.NonceVerification
      return '/wp-admin' . $page;
    }
    return '/unknown';
  }

  private function db_spans(): array
  {
    if (!$this->apm_db_queries_enabled()) {
      return [];
    }

    global $wpdb;
    if (!isset($wpdb) || empty($wpdb->queries) || !is_array($wpdb->queries)) {
      return [];
    }

    $spans = [];
    foreach ($wpdb->queries as $query) {
      // Each entry is [sql, time_in_seconds, backtrace_string]
      if (!isset($query[0], $query[1])) {
        continue;
      }
      $spans[] = [
        'kind' => 'db',
        'sql' => $this->normalize_sql((string) $query[0]),
        'duration_ms' => round((float) $query[1] * 1000.0, 3),
      ];
    }

    return $spans;
  }

  private function normalize_sql(string $sql): string
  {
    // Replace single-quoted strings and standalone numeric literals with ?
    $sql = preg_replace("/'(?:[^'\\\\]|\\\\.)*'/", '?', $sql) ?? $sql;
    $sql = preg_replace('/\b\d+(?:\.\d+)?\b/', '?', $sql) ?? $sql;
    return preg_replace('/\s+/', ' ', trim($sql)) ?? trim($sql);
  }

  private function apm_enabled(): bool
  {
    return !empty(self::settings()['apm_enabled']);
  }

  private function apm_db_queries_enabled(): bool
  {
    return !empty(self::settings()['apm_db_queries']);
  }

  private function notify(array $error): void
  {
    $signature = $this->error_signature($error);
    if (isset($this->reported_errors[$signature])) {
      return;
    }
    $this->reported_errors[$signature] = true;

    if (!$this->should_sample()) {
      return;
    }

    $settings = self::settings();
    $url = trailingslashit(rtrim((string) $settings['endpoint'], '/')) . 'api/projects/' . rawurlencode((string) $settings['project_slug']) . '/notices';
    $payload = $this->build_payload($error);
    $headers = [
      'Content-Type' => 'application/json',
      'User-Agent' => 'errorgap-wordpress/' . ERRORGAP_WP_VERSION . '; ' . home_url('/'),
    ];

    if (!empty($settings['project_key'])) {
      $headers['X-Errorgap-Project-Key'] = (string) $settings['project_key'];
    }

    wp_remote_post($url, [
      'headers' => $headers,
      'body' => wp_json_encode($payload),
      'timeout' => 3,
      'blocking' => false,
    ]);
  }

  private function error_payload(array $error): array
  {
    return [
      'type' => (string) $error['type'],
      'message' => (string) $error['message'],
      'file' => (string) $error['file'],
      'line' => (int) $error['line'],
      'trace' => (array) ($error['trace'] ?? []),
    ];
  }

  private function fatal_error_payload(array $error): array
  {
    $payload = $this->error_payload($error);

    if (preg_match('/^Uncaught\s+([^:]+):\s+(.+?)\s+in\s+(.+):(\d+)(?:\nStack trace:|\z)/s', $payload['message'], $matches)) {
      $payload['type'] = $matches[1];
      $payload['message'] = $matches[2];
      $payload['file'] = $matches[3];
      $payload['line'] = (int) $matches[4];
    }

    return $payload;
  }

  private function error_signature(array $error): string
  {
    return implode("\0", [
      (string) $error['type'],
      $this->normalized_error_message((string) $error['message']),
      (string) $error['file'],
      (string) $error['line'],
    ]);
  }

  private function normalized_error_message(string $message): string
  {
    if (preg_match('/^Uncaught\s+[^:]+:\s+(.+?)\s+in\s+.+:\d+(?:\nStack trace:|\z)/s', $message, $matches)) {
      return $matches[1];
    }

    return $message;
  }

  private function build_payload(array $error): array
  {
    $request_uri = isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '';
    $method = isset($_SERVER['REQUEST_METHOD']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_METHOD'])) : '';
    $host = isset($_SERVER['HTTP_HOST']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'])) : '';
    $url = $request_uri === '' ? home_url('/') : home_url($request_uri);

    return [
      'errors' => [[
        'type' => (string) $error['type'],
        'message' => (string) $error['message'],
        'backtrace' => $this->backtrace($error),
      ]],
      'context' => [
        'environment' => $this->environment_name(),
        'url' => $url,
        'component' => 'WordPress',
        'action' => $method,
        'hostname' => $host,
        'notifier' => [
          'name' => 'errorgap-wordpress',
          'version' => ERRORGAP_WP_VERSION,
        ],
      ],
      'environment' => [
        'PHP_VERSION' => PHP_VERSION,
        'WORDPRESS_VERSION' => get_bloginfo('version'),
        'WP_ENVIRONMENT_TYPE' => function_exists('wp_get_environment_type') ? wp_get_environment_type() : '',
        'site_url' => site_url(),
        'home_url' => home_url(),
      ],
      'session' => $this->session_data(),
      'params' => [
        'query' => $this->sanitized_input(INPUT_GET),
        'body' => $this->sanitized_input(INPUT_POST),
      ],
    ];
  }

  private function backtrace(array $error): array
  {
    $frames = [[
      'file' => (string) $error['file'],
      'line' => (int) $error['line'],
      'function' => null,
    ]];

    foreach ((array) ($error['trace'] ?? []) as $frame) {
      if (empty($frame['file'])) {
        continue;
      }

      $frames[] = [
        'file' => (string) $frame['file'],
        'line' => isset($frame['line']) ? (int) $frame['line'] : null,
        'function' => $this->frame_function($frame),
      ];
    }

    return $frames;
  }

  private function frame_function(array $frame): ?string
  {
    $function = isset($frame['function']) ? (string) $frame['function'] : '';
    if ($function === '') {
      return null;
    }

    if (!empty($frame['class'])) {
      return (string) $frame['class'] . (string) ($frame['type'] ?? '::') . $function;
    }

    return $function;
  }

  private function session_data(): array
  {
    $user = wp_get_current_user();
    if (!$user || !$user->exists()) {
      return [];
    }

    return [
      'user_id' => $user->ID,
      'user_login' => $user->user_login,
      'user_email' => $user->user_email,
      'roles' => $user->roles,
    ];
  }

  private function sanitized_input(int $type): array
  {
    $input = filter_input_array($type, FILTER_UNSAFE_RAW);
    if (!is_array($input)) {
      return [];
    }

    return $this->redact($input);
  }

  private function redact(array $data): array
  {
    $redacted = [];
    foreach ($data as $key => $value) {
      $normalized_key = strtolower((string) $key);
      if (preg_match('/password|passwd|authorization|token|secret|key|nonce|cookie/', $normalized_key)) {
        $redacted[$key] = '[FILTERED]';
        continue;
      }

      if (is_array($value)) {
        $redacted[$key] = $this->redact($value);
        continue;
      }

      $redacted[$key] = is_scalar($value) ? sanitize_text_field((string) $value) : null;
    }

    return $redacted;
  }

  private function is_configured(): bool
  {
    $settings = self::settings();

    return !empty($settings['enabled'])
      && !empty($settings['endpoint'])
      && !empty($settings['project_slug']);
  }

  private function should_sample(): bool
  {
    $sample_rate = (float) (self::settings()['sample_rate'] ?? 1.0);
    if ($sample_rate >= 1.0) {
      return true;
    }

    if ($sample_rate <= 0.0) {
      return false;
    }

    return mt_rand() / mt_getrandmax() <= $sample_rate;
  }

  private function environment_name(): string
  {
    $settings = self::settings();
    if (!empty($settings['environment'])) {
      return (string) $settings['environment'];
    }

    if (function_exists('wp_get_environment_type')) {
      return wp_get_environment_type();
    }

    return 'production';
  }

  private function php_error_type(int $severity): string
  {
    $types = [
      E_ERROR => 'E_ERROR',
      E_WARNING => 'E_WARNING',
      E_PARSE => 'E_PARSE',
      E_NOTICE => 'E_NOTICE',
      E_CORE_ERROR => 'E_CORE_ERROR',
      E_CORE_WARNING => 'E_CORE_WARNING',
      E_COMPILE_ERROR => 'E_COMPILE_ERROR',
      E_COMPILE_WARNING => 'E_COMPILE_WARNING',
      E_USER_ERROR => 'E_USER_ERROR',
      E_USER_WARNING => 'E_USER_WARNING',
      E_USER_NOTICE => 'E_USER_NOTICE',
      E_STRICT => 'E_STRICT',
      E_RECOVERABLE_ERROR => 'E_RECOVERABLE_ERROR',
      E_DEPRECATED => 'E_DEPRECATED',
      E_USER_DEPRECATED => 'E_USER_DEPRECATED',
    ];

    return $types[$severity] ?? 'E_UNKNOWN';
  }

  private function is_fatal_type(int $severity): bool
  {
    return in_array($severity, [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR, E_RECOVERABLE_ERROR], true);
  }

  private static function settings(): array
  {
    $settings = get_option(ERRORGAP_WP_OPTION, []);

    return array_merge(self::default_settings(), is_array($settings) ? $settings : []);
  }
}

register_activation_hook(__FILE__, ['Errorgap_WordPress', 'activate']);
add_action('plugins_loaded', static function (): void {
  Errorgap_WordPress::instance()->boot();
});
