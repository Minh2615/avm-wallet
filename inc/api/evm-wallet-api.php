<?php
defined( 'ABSPATH' ) || exit();


class Evm_Wallet_Api {

	private static $instance;
	/**
	 * @var string
	 */
	public $namespace = 'evm-wallet/v1';

	/**
	 * @var string
	 */
	public $rest_base = '';

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'currencys/get',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_list_currency' ),
				'permission_callback' => '__return_true'
			)
		);
		register_rest_route(
			$this->namespace,
			'currencys/create',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_currency' ),
				'permission_callback' => '__return_true'
			)
		);
		register_rest_route(
			$this->namespace,
			'currencys/update/(?P<currency_id>\S+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_currency' ),
				'permission_callback' => '__return_true'
			)
		);

		register_rest_route(
			$this->namespace,
			'currencys/get/(?P<currency_id>\S+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'detail_currency' ),
				'permission_callback' => '__return_true'
			)
		);

	}

	public function update_currency( WP_REST_Request $request ){
		$params           = $request->get_params();
		$response         = new stdClass();

		try	{
			$currency_id        = $params['currency_id'] ?: 0;
			$title              = $params['title'] ?: '';
			$min_crawl          = $params['min_crawl'] ?: 0;
			$min_swap           = $params['min_swap'] ?: 0;
			$usd_rate           = $params['usd_rate'] ?: 0;
			$image_id           = $params['image'] ?: 0;
			$code               = $params['code'] ?: '';
			$transfer_fee       = $params['transfer_fee'] ?: '';
			$swap_fee           = $params['swap_fee'] ?: '';
			$max_swap      	    = $params['max_swap'] ?: '';
			$type               = $params['type'] ?: '';
			$transfer_fee_type  = $params['transfer_fee_type'] ?: '';
			$swap_fee_type      = $params['swap_fee_type'] ?: '';
			$status_currency    = $params['statusCurrency'] ?: '';

			if ( empty( $currency_id ) ) {
				throw new Exception( __( 'CurrencyID is required!', 'portal-lbh' ) );
			}

			if ( empty( $title ) ) {
				throw new Exception( __( 'Title is required!', 'portal-lbh' ) );
			}

			$currency = get_post( $currency_id );

			if ( is_wp_error( $currency ) ) {
				throw new Exception( $currency->get_error_message() );
			}

			wp_update_post( array(
				'ID' => $currency_id,
				'post_title' => $title,
				'post_type' => 'evm-balanace',
				'post_status' => 'publish',
			) );



			update_post_meta( $currency_id, 'min_crawl', $min_crawl );
			update_post_meta( $currency_id, 'min_swap', $min_swap );
			update_post_meta( $currency_id, 'usd_rate', $usd_rate );
			update_post_meta( $currency_id, 'code', $code );
			update_post_meta( $currency_id, 'transfer_fee', $transfer_fee );
			update_post_meta( $currency_id, 'swap_fee', $swap_fee );
			update_post_meta( $currency_id, 'max_swap', $max_swap );
			update_post_meta( $currency_id, 'type', $type );
			update_post_meta( $currency_id, 'transfer_fee_type', $transfer_fee_type );
			update_post_meta( $currency_id, 'swap_fee_type', $swap_fee_type );
			update_post_meta( $currency_id, 'status_currency', $status_currency);

			if ( $image_id ) {
				set_post_thumbnail( $currency_id, $image_id );
            }

			$response->status = 'success';
			$response->message = __( 'Update currency success!', 'portal-lbh' );

		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}

	public function create_currency( WP_REST_Request $request ){
		$params           = $request->get_params();
		$response         = new stdClass();

		try	{
			$title              = $params['title'] ?: '';
			$min_crawl          = $params['min_crawl'] ?: 0;
			$min_swap           = $params['min_swap'] ?: 0;
			$usd_rate           = $params['usd_rate'] ?: 0;
			$image_id           = $params['image'] ?: 0;
			$code               = $params['code'] ?: '';
			$transfer_fee       = $params['transfer_fee'] ?: '';
			$swap_fee           = $params['swap_fee'] ?: '';
			$max_swap      	    = $params['max_swap'] ?: '';
			$type               = $params['type'] ?: '';
			$transfer_fee_type  = $params['transfer_fee_type'] ?: '';
			$swap_fee_type      = $params['swap_fee_type'] ?: '';
			$status_currency    = $params['statusCurrency'] ?: '';

			if ( empty( $title ) ) {
				throw new Exception( __( 'Title is required!', 'portal-lbh' ) );
			}
			

			$post_id = wp_insert_post( array(
				'post_title' => $title,
				'post_type' => 'evm-balanace',
				'post_status' => 'publish',
			) );

			if ( is_wp_error( $post_id ) ) {
				throw new Exception( $post_id->get_error_message() );
			}

			update_post_meta( $post_id, 'min_crawl', $min_crawl );
			update_post_meta( $post_id, 'min_swap', $min_swap );
			update_post_meta( $post_id, 'usd_rate', $usd_rate );
			update_post_meta( $post_id, 'code', $code );
			update_post_meta( $post_id, 'transfer_fee', $transfer_fee );
			update_post_meta( $post_id, 'swap_fee', $swap_fee );
			update_post_meta( $post_id, 'max_swap', $max_swap );
			update_post_meta( $post_id, 'type', $type );
			update_post_meta( $post_id, 'transfer_fee_type', $transfer_fee_type );
			update_post_meta( $post_id, 'swap_fee_type', $swap_fee_type );
			update_post_meta( $post_id, 'status_currency', $status_currency );

			if ( $image_id ) {
				set_post_thumbnail( $post_id, $image_id );
            }

			$response->status = 'success';
			$response->message = __( 'Create currency success!', 'portal-lbh' );

		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}

	public function get_list_currency( WP_REST_Request $request ) {
		$response       = new stdClass();
		$response->data = array();
        try {
			$args_query = array(
				'post_type' => 'evm-balanace',
				'posts_per_page' => -1,
                'post_status' => 'publish',
                'orderby' => 'date',
                'order' => 'DESC',
			);
			$the_query = new WP_Query( $args_query );

			if ( $the_query->have_posts() ) {
				while ( $the_query->have_posts() ) {
                    $the_query->the_post();
                    $response->data[] = array(
                        'id'     => get_the_ID(),
                        'title'  => get_the_title(),
						'sub_title' => get_post_meta(get_the_ID(), 'sub_title', true) ?: get_the_title(),
                        'amount' => get_post_meta(get_the_ID(), 'evm_amount', true) ?: 0,
						'price_amount' => get_post_meta(get_the_ID(), 'evm_price_amount', true) ?: 0,
                        'image'  => get_the_post_thumbnail_url( get_the_ID(), 'full' ),
                    );
                }
            } else {
				$response->status = 'error';
				$response->message = 'No data';
			}

			wp_reset_postdata();
			$response->status ='success';

		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}

	public function detail_currency( WP_REST_Request $request ) {
		$params           = $request->get_params();
		$response         = new stdClass();

		try {

			$currency_id = $params['currency_id'] ?? '';

			if ( empty( $currency_id ) ) {
				throw new Exception( __( 'ID is required!', 'portal-lbh' ) );
			}

			$currency = get_post( $currency_id );

			if ( is_wp_error( $currency ) ) {
                throw new Exception( $currency->get_error_message() );
            }
			
			$title  = $currency->post_title;
			$attachment_id  = get_post_meta( $currency_id, '_thumbnail_id', true );
			$min_crawl = get_post_meta( $currency_id, 'min_crawl', true ) ?: 0;
			$min_swap = get_post_meta( $currency_id,'min_swap', true )?: 0;
			$usd_rate = get_post_meta( $currency_id, 'usd_rate', true )?: 0;
			$code = get_post_meta( $currency_id, 'code', true )?: '';
			$transfer_fee = get_post_meta( $currency_id, 'transfer_fee', true )?: '';
			$swap_fee = get_post_meta( $currency_id,'swap_fee', true )?: '';
			$max_swap = get_post_meta( $currency_id,'max_swap', true )?: '';
			$type = get_post_meta( $currency_id, 'type', true )?: '';
			$transfer_fee_type = get_post_meta( $currency_id, 'transfer_fee_type', true )?: '';
			$swap_fee_type = get_post_meta( $currency_id,'swap_fee_type', true )?: '';
			$status_currency = get_post_meta( $currency_id,'status_currency', true )?: '';

			$data = array(
				'id' => $currency_id,
                'title' => $title,
                'min_crawl' => $min_crawl,
                'min_swap' => $min_swap,
                'usd_rate' => $usd_rate,
                'code' => $code,
                'transfer_fee' => $transfer_fee,
                'swap_fee' => $swap_fee,
                'max_swap' => $max_swap,
                'type' => $type,
                'transfer_fee_type' => $transfer_fee_type,
                'swap_fee_type' => $swap_fee_type,
                'status_currency' => $status_currency,
				'image_url' => wp_get_attachment_url( $attachment_id ),
				'image_id' => $attachment_id,
            );
			
			$response->data   = $data;
			$response->status = 'success';

		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}


}
Evm_Wallet_Api::instance();