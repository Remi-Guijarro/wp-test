<?php
if ( is_array( $filters ) && count( $filters ) > 0 ) : ?>
		<div class="qodef-import-demos-filter-holder">
			<?php
			foreach ( $filters as $filter ) :
				?>
			<a class="qodef-import-demos-filter" data-filter=".qodef-filter-<?php echo esc_attr( strtolower( str_replace( ' ', '-', $filter ) ) ); ?>" href="#"><?php echo esc_html( $filter ); ?></a>
		<?php endforeach; ?>
		</div>
	<?php
endif;
