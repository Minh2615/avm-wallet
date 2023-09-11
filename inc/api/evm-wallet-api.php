<?php
defined( 'ABSPATH' ) || exit();


class LearnPress_Google_Setting_Api {

	private static $instance;
	/**
	 * @var string
	 */
	public $namespace = 'lp/google/v1';

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
			'save-config-connect',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'save_config_connect' ),
				'permission_callback' => function() {
					return $this->is_instructor();
				},
			)
		);
		register_rest_route(
			$this->namespace,
			'get-config-connect',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_config_connect' ),
				'permission_callback' => function() {
					return $this->is_instructor();
				},
			)
		);

		register_rest_route(
			$this->namespace,
			'authenticate',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'authenticate' ),
				'permission_callback' => function() {
					return $this->is_instructor();
				},
			)
		);

		// customize meetings
		register_rest_route(
			$this->namespace,
			'get-all-events',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_all_events' ),
				'permission_callback' => function() {
					return $this->is_instructor();
				},
			)
		);
		register_rest_route(
			$this->namespace,
			'meetings/get',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_meeting' ),
				'permission_callback' => function() {
					return $this->is_instructor();
				},
			)
		);
		register_rest_route(
			$this->namespace,
			'meetings/create-or-update',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_or_update_meeting' ),
				'permission_callback' => function() {
					return $this->is_instructor();
				},
			)
		);
		register_rest_route(
			$this->namespace,
			'meetings/delete/(?P<meeting_id>\S+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'delete_meeting' ),
				'permission_callback' => function() {
					return $this->is_instructor();
				},
			)
		);

		//end custom meetings
	}

	public function save_config_connect( WP_REST_Request $request ) {
		$params           = $request->get_params();
		$response         = new stdClass();
		$response->status = 'success';

		$client_id     = $params['client_id'] ?? '';
		$client_secret = $params['client_secret'] ?? '';

		try {

			if ( empty( $client_id ) || empty( $client_secret ) ) {
				throw new Exception( 'Client ID or Client Secret is empty.' );
			}

			$user      = learn_press_get_current_user();
			$user_meta = array(
				'client_id'     => $client_id,
				'client_secret' => $client_secret,
			);

			update_user_meta( $user->get_id(), '_lp_google_connect', $user_meta );

		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}

	public function authenticate( WP_REST_Request $request ) {
		$response = new stdClass();
		$params   = $request->get_params();

		$client_id     = $params['client_id'] ?? '';
		$client_secret = $params['client_secret'] ?? '';
		$client_code   = $params['client_code'] ?? '';

		try {

			$user          = learn_press_get_current_user();
			$user_settings = get_user_meta( $user->get_id(), '_lp_google_connect', true );
			//use in re-authenticate
			if ( ! empty( $user_settings ) ) {
				if ( empty( $client_id ) ) {
					$client_id = $user_settings['client_id'];
				}
				if ( empty( $client_secret ) ) {
					$client_secret = $user_settings['client_secret'];
				}
			}

			if ( empty( $client_code ) || empty( $client_id ) || empty( $client_secret ) ) {
				throw new Exception( __( 'Please do not leave any fields blank.', 'learnpress-live' ) );
			}

			$token = LP_Google_Auth::instance()->generateAccessToken( $client_id, $client_secret, $client_code );

			if ( is_wp_error( $token ) ) {
				$response->status  = 'error';
				$response->message = $token->get_error_message();
			} else {
				//update option
				$user_meta = array(
					'client_id'     => $client_id,
					'client_secret' => $client_secret,
					'client_code'   => $client_code,
				);

				update_user_meta( $user->get_id(), '_lp_google_connect', $user_meta );
				update_user_meta( $user->get_id(), '_lp_google_token', $token );
				update_user_meta( $user->get_id(), '_lp_refresh_token', $token->refresh_token );//using for re-authenticate

				$response->status  = 'success';
				$response->message = 'Save config connect success.';
			}
		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}
		return rest_ensure_response( $response );
	}

	public function get_config_connect( WP_REST_Request $request ) {
		$response = new stdClass();

		$user      = learn_press_get_current_user();
		$meta_data = get_user_meta( $user->get_id(), '_lp_google_connect', true );
		$token     = get_user_meta( $user->get_id(), '_lp_google_token', true );

		if ( ! empty( $meta_data ) ) {
			$response->data = $meta_data;
			if ( ! empty( $token->access_token ) ) {
				$response->authenticated = true;
			} else {
				$response->authenticated = false;
			}
		} else {
			$response->data = array();
		}

		return rest_ensure_response( $response );
	}

	public function get_all_events( WP_REST_Request $request ) {
		$response         = new stdClass();
		$response->status = 'success';

		$user       = learn_press_get_current_user();
		$data_token = get_user_meta( $user->get_id(), '_lp_google_token', true );

		try {
			if ( empty( $data_token ) ) {
				throw new Exception( __( 'Please connect to Google Meet.', 'learnpress-live' ) );
			}

			$body        = array();
			$request_url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
			$auth        = 'Bearer ' . $data_token->access_token;
			$results     = LP_Google_Auth::instance()->learnpress_google_requests( $body, 'GET', $auth, $request_url );

			if ( isset( $results['code'] ) && $results['code'] == 200 ) {
				$response->data = $results['body'];
				if ( empty( $results['body']->items ) ) {
					$response->message = __( 'No meeting found!', 'learnpress-live' );
					$response->status  = 'error';
				}
			} else {
				$response->message = $results['error'] ?? __( 'Error meetings!', 'learnpress-live' );
				$response->status  = 'error';
			}
		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}

	public function get_meeting( WP_REST_Request $request ) {
		$response         = new stdClass();
		$response->status = 'success';

		$user       = learn_press_get_current_user();
		$data_token = get_user_meta( $user->get_id(), '_lp_google_token', true );

		try {
			if ( empty( $data_token ) ) {
				throw new Exception( __( 'Please connect to Google Meet.', 'learnpress-live' ) );
			}

			$params = $request->get_params();
			$id     = $params['ID'] ?: '';
			$body   = array();

			$request_url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events/' . $id;
			$auth        = 'Bearer ' . $data_token->access_token;
			$results     = LP_Google_Auth::instance()->learnpress_google_requests( $body, 'GET', $auth, $request_url );

			if ( isset( $results['code'] ) && $results['code'] == 200 ) {
				$response->data = $results['body'];
			} else {
				$response->message = $results['error'] ?? __( 'Error meetings!', 'learnpress-live' );
				$response->status  = 'error';
			}
		} catch ( Exception $e ) {
			$response->status  = 'error';
			$response->message = $e->getMessage();
		}

		return rest_ensure_response( $response );
	}

}
LearnPress_Google_Setting_Api::instance();
