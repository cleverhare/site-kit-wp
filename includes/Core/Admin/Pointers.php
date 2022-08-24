<?php
/**
 * Class Google\Site_Kit\Core\Admin\Pointers
 *
 * @package   Google\Site_Kit\Core\Admin
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Admin;

use Google\Site_Kit\Core\Util\BC_Functions;
use Google\Site_Kit\Core\Util\Method_Proxy_Trait;

/**
 * Class for managing pointers.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Pointers {

	use Method_Proxy_Trait;

	/**
	 * Registers functionality through WordPress hooks.
	 *
	 * @since n.e.x.t
	 */
	public function register() {
		add_action( 'admin_enqueue_scripts', $this->get_method_proxy( 'enqueue_pointers' ) );
	}

	/**
	 * Enqueues pointer scripts.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	private function enqueue_pointers( $hook_suffix ) {
		if ( empty( $hook_suffix ) ) {
			return;
		}
		$pointers = $this->get_pointers();
		if ( empty( $pointers ) ) {
			return;
		}

		$active_pointers = array_filter(
			$pointers,
			function( Pointer $pointer ) use ( $hook_suffix ) {
				return $pointer->is_active( $hook_suffix );
			}
		);

		if ( empty( $active_pointers ) ) {
			return;
		}

		wp_enqueue_style( 'wp-pointer' );
		wp_enqueue_script( 'wp-pointer' );

		foreach ( $active_pointers as $pointer ) {
			add_action(
				'admin_print_footer_scripts',
				function() use ( $pointer ) {
					$this->print_pointer_script( $pointer );
				}
			);
		}
	}

	/**
	 * Gets pointers.
	 *
	 * @since n.e.x.t
	 *
	 * @return Pointer[] Array of pointers.
	 */
	private function get_pointers() {
		/**
		 * Filters the list of available pointers.
		 *
		 * @since n.e.x.t
		 *
		 * @param array $pointers List of Pointer instances.
		 */
		$pointers = apply_filters( 'googlesitekit_admin_pointers', array() );

		return array_filter(
			$pointers,
			function( $pointer ) {
				return $pointer instanceof Pointer;
			}
		);
	}

	/**
	 * Prints script for a given pointer.
	 *
	 * @since n.e.x.t
	 *
	 * @param Pointer $pointer Pointer to print.
	 */
	private function print_pointer_script( $pointer ) {
		$slug = $pointer->get_slug();
		$args = $pointer->get_args();

		if ( is_callable( $args['content'] ) ) {
			$content = call_user_func( $args['content'] );
			if ( empty( $content ) ) {
				return;
			}
		} else {
			$content = '<p>' . wp_kses( $args['content'], 'googlesitekit_admin_pointer' ) . '</p>';
		}

		BC_Functions::wp_print_inline_script_tag(
			sprintf(
				'
				jQuery( function() {
					var options = {
						content: "<h3>%s</h3>%s",
						position: {
							edge:  "left",
							align: "right",
						},
						pointerClass: "wp-pointer arrow-top",
						pointerWidth: 420,
						close: function() {
							jQuery.post(
								window.ajaxurl,
								{
									pointer: "%s",
									action:  "dismiss-wp-pointer",
								}
							);
						}
					};
		
					jQuery( "#%s" ).pointer( options ).pointer( "open" );
				} );
				',
				esc_js( $args['title'] ),
				$content,
				esc_js( $slug ),
				esc_js( $args['target_id'] )
			),
			array(
				'id' => $slug,
			)
		);
	}
}
