=== errorgap ===
Contributors: jgrubbs, errorgap
Tags: errors, exceptions, monitoring, logging
Requires at least: 5.8
Tested up to: 7.0.2
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Reports WordPress PHP errors, exceptions, and shutdown fatals to errorgap.

== Description ==

errorgap captures WordPress runtime failures and sends them to an errorgap project using the native errorgap notice endpoint.

The plugin is intentionally dependency-free and uses WordPress core APIs for settings, sanitization, and HTTP delivery.

== Installation ==

1. Copy this directory to `wp-content/plugins/errorgap`.
2. Activate the errorgap plugin in WordPress.
3. Open Settings > errorgap.
4. Enter your errorgap endpoint and project slug.
5. Enable reporting.

Alternatively, skip the settings screen and define constants in `wp-config.php` (see Configuration below). Reporting turns on automatically when both `ERRORGAP_ENDPOINT` and `ERRORGAP_PROJECT_SLUG` are defined.

== Configuration ==

Endpoint:
The base URL for your errorgap instance, for example `https://errorgap.example.com`.

Project slug:
The errorgap project slug. Notices are sent to `/api/projects/{project_slug}/notices`.

Project key:
The errorgap Project API key. It is sent as `X-Errorgap-Project-Key`.

Environment:
Defaults to `wp_get_environment_type()`, then `production`.

Sample rate:
Use `1.0` to report every captured error. Lower values sample captured notices before sending.

Constants:
Every connection setting can also be defined in `wp-config.php`, above the `/* That's all, stop editing! */` line. Constants take precedence over values saved on the settings screen, and keep the project key out of the database:

`define('ERRORGAP_ENDPOINT', 'https://errorgap.example.com');`
`define('ERRORGAP_PROJECT_SLUG', 'my-project');`
`define('ERRORGAP_API_KEY', getenv('ERRORGAP_API_KEY'));`
`define('ERRORGAP_ENVIRONMENT', 'production'); // optional`
`define('ERRORGAP_ENABLED', true); // optional; implied when endpoint and slug are defined`

Empty values and `getenv()` misses are ignored, so the defines are safe in environments where the variables are not set.

== Changelog ==

= 0.1.0 =
* Initial errorgap WordPress notifier.
