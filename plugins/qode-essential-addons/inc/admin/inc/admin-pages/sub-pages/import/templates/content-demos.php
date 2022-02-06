<div class="qodef-import-demos qodef-import-demos--masonry">
	<div class="qodef-import-top">
		<h1><?php echo esc_html( $import_title ) ?></h1>
		<?php
			qode_essential_addons_framework_template_part( QODE_ESSENTIAL_ADDONS_ADMIN_PATH . '/inc', 'admin-pages', 'sub-pages/import/templates/search', '', $params );
		?>
	</div>
	<div class="qodef-import-demos-inner">
		<div class="qodef-import-demos-grid-sizer"></div>
		<div class="qodef-import-demos-grid-gutter"></div>
		<?php
		foreach ( $demos as $key => $demo ) :

			$item_category = array();
			if ( isset( $demo['demo_filters'] ) ) {
				foreach ( $demo['demo_filters'] as $demo_filter ) {
					$item_category[] = 'qodef-filter-' . strtolower( str_replace( ' ', '-', $demo_filter ) );
				}
			}
			?>
			<article class="qodef-import-demo <?php echo implode( ' ', $item_category ); ?> qodef--visible">
				<div class="qodef-import-demo-inner">
					<div class="qodef-import-demo-image">
						<img src="<?php echo esc_url( $demo['demo_image_url'] ); ?>" />
					</div>
					<div class="qodef-import-demo-text">
						<h4 class="qodef-import-demo-title"><?php echo esc_attr( $demo['demo_name'] ); ?></h4>
						<a class="qodef-import-demo-link" data-demo-id="<?php echo esc_attr( $key ); ?>" href="<?php echo add_query_arg( array( 'item-id' => esc_attr( $key ) ), menu_page_url( $page_name, false ) ); ?>">
							<?php esc_html_e( 'Import', 'qode-essential-addons' ); ?>
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="13px" height="11px" viewBox="0 0 13 11" enable-background="new 0 0 13 11" xml:space="preserve">
								<g>
									<g>
										<path d="M7.017,0.498v6.258l2.225-2.118C9.479,4.39,9.721,4.384,9.966,4.624c0.248,0.238,0.242,0.472-0.016,0.7L6.855,8.313
											C6.813,8.375,6.759,8.416,6.694,8.437C6.63,8.458,6.565,8.468,6.501,8.468S6.372,8.458,6.308,8.437
											C6.243,8.416,6.189,8.375,6.146,8.313L3.052,5.324c-0.258-0.229-0.263-0.462-0.016-0.7c0.247-0.24,0.489-0.234,0.726,0.015
											l2.224,2.118V0.498c0-0.146,0.048-0.265,0.145-0.358S6.351,0,6.501,0c0.15,0,0.274,0.047,0.371,0.14S7.017,0.353,7.017,0.498z"/>
									</g>
									<path d="M12.855,5.878c-0.097-0.093-0.22-0.14-0.371-0.14c-0.149,0-0.273,0.047-0.37,0.14s-0.146,0.213-0.146,0.358v3.767H1.032
										V6.237c0-0.146-0.048-0.265-0.145-0.358s-0.221-0.14-0.371-0.14c-0.151,0-0.274,0.047-0.371,0.14S0.001,6.091,0.001,6.237L0,11
										h0.001H13V6.237C13,6.091,12.952,5.972,12.855,5.878z"/>
								</g>
							</svg>
						</a>
					</div>
				</div>
			</article>
		<?php endforeach; ?>
		<?php wp_nonce_field( 'qode_essential_addons_demo_import_nonce', 'qode_essential_addons_demo_import_nonce' ); ?>
	</div>
</div>

<div class="qodef-demo-single">
	<?php
	if ( isset( $single_demo ) && '' !== $single_demo ) {
		echo qode_essential_addons_framework_get_template_part( QODE_ESSENTIAL_ADDONS_ADMIN_PATH . '/inc', 'admin-pages', 'sub-pages/import/templates/content-single', '', array( 'demo' => $single_demo, 'demo_key' => $single_demo_id, 'content_files' => $content_files ) );
	}
	?>
</div>

