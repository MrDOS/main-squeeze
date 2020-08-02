<?php

/**
 * Plugin Name: Main Squeeze
 * Plugin URI:  https://github.com/MrDOS/main-squeeze
 * Description: Squeeze code samples down to a more reasonable size.
 * Version:     1.0.0
 * Author:      Samuel Coleman
 * Author URI:  https://seenet.ca
 * License:     GPL v2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

define('MAIN_SQUEEZE_OPEN', '«');
define('MAIN_SQUEEZE_CLOSE', '»');

function main_squeeze_filter_block($block_content, $block)
{
    if ($block['blockName'] !== 'core/code')
    {
        return $block_content;
    }

    $block_content = str_replace(MAIN_SQUEEZE_OPEN, '<span class="main-squeeze-expansion">', $block_content);
    $block_content = str_replace(MAIN_SQUEEZE_CLOSE, '</span>', $block_content);
    return $block_content;
}

function main_squeeze_enqueue() {
    wp_enqueue_script('main-squeeze-script',
                      plugins_url('main-squeeze.js', __FILE__),
                      array('wp-blocks', 'wp-dom-ready'),
                      filemtime(plugin_dir_path(__FILE__) . '/main-squeeze.js'),
                      /* $in_footer = */ true);

    wp_enqueue_style('main-squeeze-style',
                     plugins_url('main-squeeze.css', __FILE__),
                     [],
                     filemtime(plugin_dir_path(__FILE__) . '/main-squeeze.css'));
}

add_filter('render_block', 'main_squeeze_filter_block', 10, 2);
add_action('enqueue_block_assets', 'main_squeeze_enqueue');
