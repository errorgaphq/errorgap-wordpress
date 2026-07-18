# errorgap | WordPress

WordPress plugin for reporting PHP errors, exceptions, and shutdown fatals to
**errorgap**.

This is an updated, dependency-free successor in spirit to the old
`airbrake-wordpress` plugin. It uses WordPress core APIs instead of Composer
vendor code and sends Errorgap's native JSON notice envelope.

## Install

Copy this repository into a WordPress install (the folder name `errorgap` matches the WordPress.org slug):

```bash
cp -R errorgap-wordpress /path/to/wordpress/wp-content/plugins/errorgap
```

Activate the plugin, then configure it either via constants in `wp-config.php` or on `Settings > Errorgap`.

## Configure via wp-config.php (recommended)

Add above the `/* That's all, stop editing! */` line:

```php
define('ERRORGAP_ENDPOINT', 'https://errorgap.example.com');
define('ERRORGAP_PROJECT_SLUG', 'my-project');
define('ERRORGAP_API_KEY', getenv('ERRORGAP_API_KEY'));
```

Constants take precedence over values saved on the settings screen, and keep the project key out of the database. Reporting is implied on when both `ERRORGAP_ENDPOINT` and `ERRORGAP_PROJECT_SLUG` are defined; `ERRORGAP_ENABLED` and `ERRORGAP_ENVIRONMENT` are optional overrides. Empty values and `getenv()` misses are ignored.

## Settings

- Endpoint: base URL for Errorgap, for example `https://errorgap.example.com`
- Project slug: Errorgap project slug
- Project key: optional; sent as `X-Errorgap-Project-Key` when present
- Environment: optional override, otherwise WordPress environment type
- Sample rate: `1.0` reports every captured notice

Notices are posted to:

```text
{endpoint}/api/projects/{project_slug}/notices
```

## Payload

The plugin sends Errorgap's compact Airbrake-like notice envelope:

```json
{
  "errors": [
    {
      "type": "E_WARNING",
      "message": "Example warning",
      "backtrace": [
        {
          "file": "/var/www/html/wp-content/plugins/example/example.php",
          "line": 42,
          "function": "example_callback"
        }
      ]
    }
  ],
  "context": {
    "environment": "production",
    "url": "https://example.com/page",
    "component": "WordPress",
    "action": "GET"
  },
  "environment": {
    "PHP_VERSION": "8.3.0",
    "WORDPRESS_VERSION": "6.5"
  },
  "session": {},
  "params": {}
}
```

## License

GPL-2.0-or-later.
