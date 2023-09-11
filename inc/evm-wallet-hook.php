<?php

defined( 'ABSPATH' ) || exit();

if( ! class_exists( 'EVM_WALLET_HOOK' ) ) {
	class EVM_WALLET_HOOK {

		protected static $instance = null;

		protected function __construct() {
			add_action( 'init', array( $this, 'register_post_type' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'add_admin_scripts' ) );
		}

		public function register_post_type(){
			$labels = array(
				'name'                  => _x( 'Balance', 'Post type general name', 'evm-tracking' ),
				'singular_name'         => _x( 'Balance', 'Post type singular name', 'evm-tracking' ),
				'menu_name'             => _x( 'Balance', 'Admin Menu text', 'evm-tracking' ),
				'name_admin_bar'        => _x( 'Balance', 'Add New on Toolbar', 'evm-tracking' ),
				'add_new'               => __( 'Add New', 'evm-tracking' ),
				'add_new_item'          => __( 'Add New Balance', 'evm-tracking' ),
				'new_item'              => __( 'New Balance', 'evm-tracking' ),
				'edit_item'             => __( 'Edit Balance', 'evm-tracking' ),
				'view_item'             => __( 'View Balance', 'evm-tracking' ),
				'all_items'             => __( 'All Balance', 'evm-tracking' ),
				'search_items'          => __( 'Search Balance', 'evm-tracking' ),
				'parent_item_colon'     => __( 'Parent Balance:', 'evm-tracking' ),
				'not_found'             => __( 'No Balance found.', 'evm-tracking' ),
				'not_found_in_trash'    => __( 'No Balance found in Trash.', 'evm-tracking' ),
				'archives'              => _x( 'Balance archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'evm-tracking' ),
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

		public function add_admin_scripts() {
			// $v = rand();
			// // wp_enqueue_style( 'kiot-admin-config', THIM_TREE_URL . 'asset/admin/css/config.css', array(), '1.0.0' );
			// wp_enqueue_script( 'gia-pha-admin-config', THIM_TREE_URL . 'assets/js/config.js', array( 'jquery', 'wp-api-fetch', 'wp-url' ), $v, true );
			// wp_localize_script(
			// 	'gia-pha-admin-config',
			// 	'mo_localize_script',
			// 	array(
			// 		'ajaxurl' => admin_url( 'admin-ajax.php' ),
			// 	)
			// );
		}

		public static function instance(): EVM_WALLET_HOOK {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
	
			return self::$instance;
		}
	}
}