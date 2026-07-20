=== Errorgap ===
Contributors: jgrubbs, errorgap
Tags: errors, monitoring, logging
Requires at least: 5.8
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 0.2.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Reports WordPress PHP errors, exceptions, and shutdown fatals to errorgap.

== Description ==

errorgap captures WordPress runtime failures and sends them to an errorgap project using the native errorgap notice endpoint.

The plugin is intentionally dependency-free and uses WordPress core APIs for settings, sanitization, and HTTP delivery.

Reporting is disabled by default. A site administrator must configure an Errorgap endpoint and enable reporting before the plugin sends data.

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

APM:
Optionally record request timings and send APM transactions. Database query spans can also be included; SQL string and numeric literals are replaced with placeholders before transmission. APM can also be enabled from `wp-config.php` with `define('ERRORGAP_APM_ENABLED', true);` and `define('ERRORGAP_APM_DB_QUERIES', true);`.

Reported severities:
The plugin reports its own set of PHP error severities (errors and warnings) independently of the site's global error-reporting level, so activating it never changes how the rest of your site reports or displays PHP errors. Notices, deprecations, and strict notices are not reported by default. Adjust the set with the `errorgap_reported_severities` filter:

`add_filter('errorgap_reported_severities', fn() => E_ALL & ~E_DEPRECATED);`

Constants:
Every connection setting can also be defined in `wp-config.php`, above the `/* That's all, stop editing! */` line. Constants take precedence over values saved on the settings screen, and keep the project key out of the database:

`define('ERRORGAP_ENDPOINT', 'https://errorgap.example.com');`
`define('ERRORGAP_PROJECT_SLUG', 'my-project');`
`define('ERRORGAP_API_KEY', getenv('ERRORGAP_API_KEY'));`
`define('ERRORGAP_ENVIRONMENT', 'production'); // optional`
`define('ERRORGAP_ENABLED', true); // optional; implied when endpoint and slug are defined`

Empty values and `getenv()` misses are ignored, so the defines are safe in environments where the variables are not set.

== External Service and Data Disclosure ==

This plugin connects to the Errorgap endpoint configured by the site administrator. The service receives and stores error reports and, when APM is enabled, performance transactions so administrators can diagnose application failures and performance problems. The plugin does not send data until reporting has been explicitly enabled or enabled through the documented `wp-config.php` constants.

Error reports may include error types and messages, request URLs, HTTP methods and hostnames, backtrace file paths and function names, source-code excerpts surrounding failing lines, WordPress and PHP versions, environment and site URLs, sanitized GET and POST parameters, and the ID, login, email address, and roles of a logged-in WordPress user. Fields whose names indicate passwords, authorization values, tokens, secrets, keys, nonces, or cookies are replaced with `[FILTERED]`; other request values may still contain personal or sensitive information.

When APM is enabled, transactions may include request paths, response status codes, durations, environment names, and timestamps. If database query spans are also enabled, normalized SQL statements and their durations are sent. String and numeric SQL literals are replaced with placeholders before transmission.

The destination and data-handling terms depend on the endpoint selected by the administrator. For the hosted Errorgap service, see the [Errorgap Privacy Policy](https://errorgap.com/privacy) and [Errorgap Terms of Service](https://errorgap.com/terms). Administrators using a self-hosted or third-party endpoint are responsible for that endpoint's data handling and disclosures.

== Frequently Asked Questions ==

= Does the plugin send data immediately after activation? =

No. Reporting is disabled by default. It starts only after an administrator configures an endpoint and enables reporting, or defines the documented endpoint and project-slug constants in `wp-config.php`.

= What information is sent to Errorgap? =

See the External Service and Data Disclosure section above. Error reports can contain source excerpts, request data, site and runtime information, and logged-in user information. Secret-like request fields are filtered by name, but administrators should review the disclosure before enabling reporting.

= Can the project key be kept out of the WordPress database? =

Yes. Define `ERRORGAP_API_KEY` and the other connection constants in `wp-config.php`. Constants take precedence over saved settings.

= Can I send reports to a self-hosted Errorgap instance? =

Yes. Set the endpoint to the base URL of the compatible Errorgap instance. The site administrator is responsible for the privacy, security, and data-handling practices of the selected endpoint.

== Screenshots ==

1. Errorgap connection, error reporting, sampling, and APM settings in WordPress admin.

== Changelog ==

= 0.2.0 =
* Report a plugin-defined set of PHP error severities (errors and warnings) instead of reading the site's global error-reporting level, so activating the plugin never changes how the rest of the site reports or displays errors. Adjustable with the `errorgap_reported_severities` filter.
* Report nested exception causes: the `getPrevious()` chain is captured as `context.causes` and each cause's frames are merged into a single backtrace.
* Mark backtrace frames as in-app (theme/plugin/mu-plugin code) or vendor (WordPress core) so the dashboard can separate application frames from core.
* Avoid reporting an uncaught exception twice (once from the exception handler, once from the shutdown handler).
* Allow enabling APM and DB query spans from `wp-config.php` via `ERRORGAP_APM_ENABLED` and `ERRORGAP_APM_DB_QUERIES`.

= 0.1.0 =
* Initial errorgap WordPress notifier.
* Ships source excerpts with backtrace frames so errorgap renders code context without repository access.
