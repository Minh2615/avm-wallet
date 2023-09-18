<?php
/*
Plugin Name: AnyEVM Crypto Payment GateWay
Version: 1.0
Description: Support WooCommerce payment
Author: Minh Dev
Text Domain: evm-wallet
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
// const
define( 'EVM_WALLET_PLUGIN_PATH', dirname( __FILE__ ) );
define( "EVM_WALLET_DIR", __DIR__ );
define( 'EVM_WALLET_URL', plugin_dir_url( __FILE__ ) );
define( "EVM_WALLET_FILENAME", __FILE__ );
define( "EVM_WALLET_TEMPLATES" , EVM_WALLET_DIR . '/templates' );

if ( ! class_exists( 'EVM_WALLET_WP' ) ) {

	class EVM_WALLET_WP {

		private static $instance = null;

		public function __construct()
		{
			$this->includes();
		}

		public static function instance()
		{
			if (self::$instance == null) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		public function includes(){
			//functions
			require_once( EVM_WALLET_DIR. '/inc/functions.php' );
			//api
			require_once EVM_WALLET_DIR . '/inc/api/evm-wallet-api.php';

			// Hooks
			require_once EVM_WALLET_DIR . '/inc/evm-wallet-hook.php';
			EVM_WALLET_HOOK::instance();
		}
				
	}
}

EVM_WALLET_WP::instance();