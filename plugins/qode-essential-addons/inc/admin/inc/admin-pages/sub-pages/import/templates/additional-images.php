<?php $params['single_image_class'] = 'swiper-slide'; ?>
<div class="qodef-demo-sliders">
	<div class="qodef-swiper-container">
		<div class="swiper-wrapper">
			<?php
				qode_essential_addons_framework_template_part( QODE_ESSENTIAL_ADDONS_ADMIN_PATH . '/inc', 'admin-pages', 'sub-pages/import/templates/image', '', $params );
				foreach ( $demo['demo_additional_images_urls'] as $demo_additional_image_url ){ ?>
					<div class="swiper-slide">
						<img src="<?php echo esc_url( $demo_additional_image_url ); ?>" alt="<?php echo esc_attr( $demo['demo_name'] ); ?>" />
					</div>
				<?php }
				?>
		</div>
	</div>
	<div class="qodef-swiper-container-thumbs">
		<div class="swiper-wrapper">
			<?php
			qode_essential_addons_framework_template_part( QODE_ESSENTIAL_ADDONS_ADMIN_PATH . '/inc', 'admin-pages', 'sub-pages/import/templates/image', '', $params );
			foreach ( $demo['demo_additional_images_urls'] as $demo_additional_image_url ){ ?>
				<div class="swiper-slide">
					<img src="<?php echo esc_url( $demo_additional_image_url ); ?>" alt="<?php echo esc_attr( $demo['demo_name'] ); ?>" />
				</div>
			<?php }
			?>
		</div>
	</div>
</div>