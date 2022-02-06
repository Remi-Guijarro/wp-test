<?php
if ( ! function_exists( 'qode_essential_addons_demos_list' ) ) {
	/**
	 * Function that return list of demoes if exists
	 *
	 * @return array
	 */
	function qode_essential_addons_demos_list() {

		return apply_filters( 'qode_essential_addons_filter_demos_list', array() );

	}
}

if ( ! function_exists( 'qode_essential_addons_demos_list_has_elements' ) ) {
	/**
	 * Function that check is demos list has elements
	 *
	 * @return bool
	 */
	function qode_essential_addons_demos_list_has_elements( $has_elements ) {
		$demos = qode_essential_addons_demos_list();
		if ( ! empty( $demos ) ) {
			$has_elements = true;
		}

		return $has_elements;
	}

	add_filter( 'qode_essential_addons_filter_import_visible', 'qode_essential_addons_demos_list_has_elements' );
}

if ( ! function_exists( 'qode_essential_addons_decode_content' ) ) {
	/**
	 * Function that decode content
	 *
	 * @return array/bool
	 */
	function qode_essential_addons_decode_content( $url ) {

		$content = qode_essential_addons_get_file_content( $url );

		if ( false !== $content ) {
			$decoded_content = json_decode( $content, true );

			return $decoded_content;
		}

		return false;
	}
}
if ( ! function_exists( 'qode_essential_addons_get_file_content' ) ) {
	/**
	 * Function that return file content
	 *
	 * @return bool
	 */
	function qode_essential_addons_get_file_content( $url ) {

		$response = wp_remote_get( $url );

		if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
			return wp_remote_retrieve_body( $response );
		}

		return false;

	}
}