=== errorgap ===
Contributors: jgrubbs
Tags: errors, exceptions, monitoring, logging
Requires at least: 5.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Reports WordPress PHP errors, exceptions, and shutdown fatals to errorgap.

== Description ==

errorgap captures WordPress runtime failures and sends them to an errorgap project using the native errorgap notice endpoint.

The plugin is intentionally dependency-free and uses WordPress core APIs for settings, sanitization, and HTTP delivery.

== Installation ==

1. Copy this directory to `wp-content/plugins/errorgap-wordpress`.
2. Activate the errorgap plugin in WordPress.
3. Open Settings > errorgap.
4. Enter your errorgap endpoint and project slug.
5. Enable reporting.

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

== Changelog ==

= 0.1.0 =
* Initial errorgap WordPress notifier.
