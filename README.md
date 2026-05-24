# errorgap | WordPress

WordPress plugin for reporting PHP errors, exceptions, and shutdown fatals to
**errorgap**.

This is an updated, dependency-free successor in spirit to the old
`airbrake-wordpress` plugin. It uses WordPress core APIs instead of Composer
vendor code and sends Errorgap's native JSON notice envelope.

## Install

Copy this repository into a WordPress install:

```bash
cp -R errorgap-wordpress /path/to/wordpress/wp-content/plugins/errorgap-wordpress
```

Activate the plugin, then open `Settings > Errorgap`.

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
