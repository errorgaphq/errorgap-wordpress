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
- APM: optionally records request timings and sends performance transactions
- APM DB queries: optionally includes normalized SQL spans and their durations

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
          "function": "example_callback",
          "source": {
            "start_line": 36,
            "lines": ["...the 6 lines around the failing line..."]
          }
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

## External service and data disclosure

Reporting is disabled by default. Once a site administrator configures an
Errorgap endpoint and enables reporting, the plugin sends error reports to
that endpoint. Reports may include error messages, request URLs, HTTP methods
and hostnames, backtrace file paths and function names, source-code excerpts,
WordPress and PHP versions, site URLs, sanitized GET and POST parameters, and
the ID, login, email address, and roles of a logged-in WordPress user.

Fields whose names indicate passwords, authorization values, tokens, secrets,
keys, nonces, or cookies are replaced with `[FILTERED]`. Other request values
may still contain personal or sensitive information.

When APM is enabled, the plugin also sends request paths, response status
codes, durations, environment names, and timestamps. Enabling database query
spans adds normalized SQL statements and durations; string and numeric SQL
literals are replaced with placeholders before transmission.

For the hosted Errorgap service, see the [Privacy Policy](https://errorgap.com/privacy)
and [Terms of Service](https://errorgap.com/terms). Administrators using a
self-hosted or third-party endpoint are responsible for that endpoint's data
handling and disclosures.

## License

GPL-2.0-or-later.
