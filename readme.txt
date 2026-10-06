=== Errorgap ===
Contributors: jgrubbs, errorgap
Tags: errors, monitoring, logging
Requires at least: 5.8
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 0.4.0
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

Sign-ins:
Optionally report sign-ins to Errorgap's Security › Logins: each successful sign-in (`wp_login`), each failed attempt on wp-login.php, XML-RPC or REST authentication (`wp_login_failed`), and each password reset (`after_password_reset`). Errorgap flags a new IP address, country or hour for a user and can alert on a sign-in after many failures. Off by default; turn it on with the Sign-ins setting or `define('ERRORGAP_AUTH_EVENTS', true);`. The app is named after the site's host (filter `errorgap_sign_in_app`); behind a proxy, supply the client address with the `errorgap_sign_in_ip` filter.

Constants:
Every connection setting can also be defined in `wp-config.php`, above the `/* That's all, stop editing! */` line. Constants take precedence over values saved on the settings screen, and keep the project key out of the database:

`define('ERRORGAP_ENDPOINT', 'https://errorgap.example.com');`
`define('ERRORGAP_PROJECT_SLUG', 'my-project');`
`define('ERRORGAP_API_KEY', getenv('ERRORGAP_API_KEY'));`
`define('ERRORGAP_ENVIRONMENT', 'production'); // optional`
`define('ERRORGAP_ENABLED', true); // optional; implied when endpoint and slug are defined`
`define('ERRORGAP_AUTH_EVENTS', true); // optional; report sign-ins`

Empty values and `getenv()` misses are ignored, so the defines are safe in environments where the variables are not set.

== External Service and Data Disclosure ==

This plugin connects to the Errorgap endpoint configured by the site administrator. The service receives and stores error reports and, when APM is enabled, performance transactions so administrators can diagnose application failures and performance problems. The plugin does not send data until reporting has been explicitly enabled or enabled through the documented `wp-config.php` constants.

Error reports may include error types and messages, request URLs, HTTP methods and hostnames, backtrace file paths and function names, source-code excerpts surrounding failing lines, WordPress and PHP versions, environment and site URLs, sanitized GET and POST parameters, and the ID, login, email address, and roles of a logged-in WordPress user. Fields whose names indicate passwords, authorization values, tokens, secrets, keys, nonces, or cookies are replaced with `[FILTERED]`; other request values may still contain personal or sensitive information.

When APM is enabled, transactions may include a random per-request identifier (also attached to errors from that request), request paths, response status codes, durations, environment names, and timestamps. If database query spans are also enabled, normalized SQL statements and their durations are sent. String and numeric SQL literals are replaced with placeholders before transmission.

When sign-in reporting is enabled, each sign-in, failed sign-in attempt and password reset sends the user name entered or signed in with, the IP address, the browser user agent, the request method and path (without the query string), the outcome and a timestamp. Passwords are never sent. Errorgap can be set to store user names as a salted hash.

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

= 0.4.0 =
* Optionally report sign-ins to Errorgap's Security › Logins: successful sign-ins, failed attempts on wp-login.php, XML-RPC and REST authentication, and password resets, with the user name, IP address and browser. Off by default (Sign-ins setting or `ERRORGAP_AUTH_EVENTS`). Passwords are never sent.

= 0.3.0 =
* With APM enabled, errors reported during a request carry that request's transaction id, so Errorgap shows the error a request raised on its trace and links each occurrence to its request. The id is random and generated per request; it identifies nothing about a visitor.
* With APM enabled, a request carrying the `x-errorgap-trace` header sent by the Errorgap browser SDK records it on its transaction, so Errorgap links the browser's view of an API call to the server request that answered it. Only a random UUID is accepted.

= 0.2.0 =
* Report a plugin-defined set of PHP error severities (errors and warnings) instead of reading the site's global error-reporting level, so activating the plugin never changes how the rest of the site reports or displays errors. Adjustable with the `errorgap_reported_severities` filter.
* Report nested exception causes: the `getPrevious()` chain is captured as `context.causes` and each cause's frames are merged into a single backtrace.
* Mark backtrace frames as in-app (theme/plugin/mu-plugin code) or vendor (WordPress core) so the dashboard can separate application frames from core.
* Avoid reporting an uncaught exception twice (once from the exception handler, once from the shutdown handler).
* Allow enabling APM and DB query spans from `wp-config.php` via `ERRORGAP_APM_ENABLED` and `ERRORGAP_APM_DB_QUERIES`.

= 0.1.0 =
* Initial errorgap WordPress notifier.
* Ships source excerpts with backtrace frames so errorgap renders code context without repository access.
