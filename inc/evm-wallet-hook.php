<?php

defined( 'ABSPATH' ) || exit();

if( ! class_exists( 'EVM_WALLET_HOOK' ) ) {
	class EVM_WALLET_HOOK {

		protected static $instance = null;

		protected function __construct() {
			add_action( 'init', array( $this, 'register_post_type' ) );
			add_action( 'template_include', array( $this, 'template_includes' ), 1000 );
			add_action( 'admin_bar_menu', array( $this, 'add_admin_menu' ), 80 );
			add_action( 'init', array( $this, 'add_rewrite_rules' ) );
		}
		
		public function add_rewrite_rules() {
			$root_slug = 'wallet-setting';

			add_rewrite_rule(
				'^wallet-setting/?$',
				'index.php?wallet-setting=$matches[1]',
				'top'
			);

			add_rewrite_rule(
				'^' . $root_slug . '/(currencys)/?(.*)?',
				'index.php?wallet-setting=1',
				'top'
			);
			add_rewrite_rule(
				'^' . $root_slug . '/(settings)/?(.*)?',
				'index.php?wallet-setting=1',
				'top'
			);
			
			add_rewrite_tag( '%wallet-setting%', '([^&]+)' );

			flush_rewrite_rules();

		}

		public function add_admin_menu( $wp_admin_bar ) {
			if ( ! $this->can_view_wallet_setting() ) {
				return;
			}
	
			$title = esc_html__( 'Wallets Settings', 'evm-wallet' );
			$href  = $this->url_page_setting();
	
			$wp_admin_bar->add_node(
				array(
					'id'    => 'evm-wallet-setting',
					'title' => '
						<img style="width: 20px; height: 20px; padding: 0; line-height: 1.84615384; vertical-align: middle; margin: -6px 0 0 0;" src="https://images-platform.99static.com//rAlXbfALSpg8LkFFzli61yIkUYY=/183x19:1320x1156/fit-in/500x500/99designs-contests-attachments/93/93346/attachment_93346584">
						<span class="ab-label">' . $title . '</span>',
					'href'  => $href,
				)
			);
		}

		/**
		 * Check is page setting.
		 *
		 * @return bool
		 */
		public function is_page_setting_wallet(): bool {
			global $wp;

			return isset( $wp->query_vars ) && array_key_exists( 'wallet-setting', $wp->query_vars );
		}

		public function register_post_type(){
			$labels = array(
				'name'                  => _x( 'Balance', 'Post type general name', 'evm-wallet' ),
				'singular_name'         => _x( 'Balance', 'Post type singular name', 'evm-wallet' ),
				'menu_name'             => _x( 'Balance', 'Admin Menu text', 'evm-wallet' ),
				'name_admin_bar'        => _x( 'Balance', 'Add New on Toolbar', 'evm-wallet' ),
				'add_new'               => __( 'Add New', 'evm-wallet' ),
				'add_new_item'          => __( 'Add New Balance', 'evm-wallet' ),
				'new_item'              => __( 'New Balance', 'evm-wallet' ),
				'edit_item'             => __( 'Edit Balance', 'evm-wallet' ),
				'view_item'             => __( 'View Balance', 'evm-wallet' ),
				'all_items'             => __( 'All Balance', 'evm-wallet' ),
				'search_items'          => __( 'Search Balance', 'evm-wallet' ),
				'parent_item_colon'     => __( 'Parent Balance:', 'evm-wallet' ),
				'not_found'             => __( 'No Balance found.', 'evm-wallet' ),
				'not_found_in_trash'    => __( 'No Balance found in Trash.', 'evm-wallet' ),
				'archives'              => _x( 'Balance archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'evm-wallet' ),
			);
		
			$args = array(
				'labels'             => $labels,
				'menu_icon'          => 'dashicons-money-alt',
				'public'             => true,
				'publicly_queryable' => true,
				'show_ui'            => true,
				'show_in_menu'       => true,
				'query_var'          => true,
				'rewrite'            => array( 'slug' => 'evm-balanace' ),
				'capability_type'    => 'post',
				'has_archive'        => true,
				'hierarchical'       => false,
				'menu_position'      => 20,
				'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments' ),
			);
		
			register_post_type( 'evm-balanace', $args );

		}

		/**
		 * It removes all actions from `wp_head` and `wp_footer` and then adds back only the ones we want
		 */
		public function setup_the_scripts() {
			add_filter( 'show_admin_bar', '__return_false' );

			remove_all_actions( 'wp_head' );
			remove_all_actions( 'wp_print_styles' );
			remove_all_actions( 'wp_print_head_scripts' );
			remove_all_actions( 'wp_footer' );

			// Handle `wp_head`
			add_action( 'wp_head', 'wp_enqueue_scripts', 1 );
			add_action( 'wp_head', 'wp_print_styles', 8 );
			add_action( 'wp_head', 'wp_print_head_scripts', 9 );
			add_action( 'wp_head', 'wp_site_icon' );

			// Handle `wp_footer`
			add_action( 'wp_footer', 'wp_print_footer_scripts', 20 );

			// Handle `wp_enqueue_scripts`
			remove_all_actions( 'wp_enqueue_scripts' );

			// Also remove all scripts hooked into after_wp_tiny_mce.
			remove_all_actions( 'after_wp_tiny_mce' );

			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), 999999 );

			do_action( 'evm-wallet/scripts/init' );
		}

		/**
		 * Get link show live setting.
		 *
		 * @return string
		 */
		public function get_slug_page(): string {
			return apply_filters( 'evm_wallet_setting_get_slug', 'wallet-setting' );
		}

		/**
		 * Get link show live setting.
		 *
		 * @return string
		 */
		public function url_page_setting(): string {
			return trailingslashit( site_url( $this->get_slug_page() ) );
		}

		public function enqueue_scripts() {

			wp_enqueue_editor(); // Support for tinymce.
			wp_enqueue_media(); // Support for tinymce media.
			wp_enqueue_script( 'media-audiovideo' );
			wp_enqueue_style( 'media-views' );
			wp_enqueue_script( 'mce-view' );
			
			$info = include EVM_WALLET_PLUGIN_PATH . '/build/evm-wallet.asset.php';
			wp_enqueue_style( 'avm-wallet-setting', EVM_WALLET_URL . '/build/evm-wallet.css', array(), $info['version'] );
			wp_enqueue_script( 'avm-wallet-setting', EVM_WALLET_URL . '/build/evm-wallet.js', $info['dependencies'], $info['version'], true );
	
			wp_localize_script(
				'avm-wallet-setting',
				'evm_wallet_setting',
				apply_filters(
					'evm_wallet_setting_localize_script',
					array(
						'page_slug'      => $this->get_slug_page(),
						'site_url'       => home_url( '/' ),
						'admin_url'      => admin_url(),
						'logout_url'     => wp_logout_url( home_url() ),
						'is_admin'       => current_user_can( 'manage_options' ),
						'nonce'          => wp_create_nonce( 'wp_rest' ),
						'page_settings'  => $this->url_page_setting(),
					)
				)
			);
			evm_wallet_tinymce_inline_scripts();

			

			do_action( 'evm_wallet/enqueue_scripts' );
			
		}
		
		public function template_includes( $template ) {

			if ( $this->is_page_setting_wallet() ) {
				if ( is_user_logged_in() ) {
	
					$this->setup_the_scripts();
	
					wp_head();
					?>
	
					<div id="evm-wallet-setting-root"></div>
	
					<?php
					wp_footer();
					return;
				} else {
					wp_redirect( home_url() );
					exit();
				}
			}

			return $template;
		}

		public function can_view_wallet_setting() {
			return is_user_logged_in() && current_user_can( 'manage_options' );
		}

		public static function instance(): EVM_WALLET_HOOK {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
	
			return self::$instance;
		}
	}
}