<?php

/**
 * Removes Errorgap plugin settings.
 *
 * @package ErrorgapWordPress
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
  exit;
}

delete_option('errorgap_wordpress_settings');
