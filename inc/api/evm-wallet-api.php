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
			'currencys/get/(?P<curency_id>\S+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'detail_currency' ),
				'permission_callback' => '__return_true'
			)
		);

	}

	public function create_currency( WP_REST_Request $request ){
		$params           = $request->get_params();
		$response         = new stdClass();
		$response->status = 'success';
		if ( !function_exists('media_handle_upload') ) {
			require_once(ABSPATH . "wp-admin" . '/includes/image.php');
			require_once(ABSPATH . "wp-admin" . '/includes/file.php');
			require_once(ABSPATH . "wp-admin" . '/includes/media.php');
		}
		$image = media_handle_upload($params['image'], 0);
		print_R($image);die;

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
		$response->status = 'success';

		$user_id     = $params['user_id'] ?? '';

		try {

			if ( empty( $user_id ) ) {
				throw new Exception( __( 'User ID is required!', 'portal-lbh' ) );
			}

			$user = get_user_by( 'id', $user_id );
				
			if ( empty( $user ) ) {
                throw new Exception( __( 'User not found!', 'portal-lbh' ) );
            }

			$data = array(
				'id'          => $user->ID,
                'email'       => $user->user_email,
                'name'        => $user->display_name,
                'role'        => $user->roles,
				'url'         => get_author_posts_url( $user->ID ),
				'user_intro'  => get_user_meta( $user->ID, 'user_intro', true ),
            );

			$response->data = $data;

		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}


}
Evm_Wallet_Api::instance();