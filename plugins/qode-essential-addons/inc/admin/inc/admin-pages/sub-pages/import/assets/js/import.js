(function ( $ ) {
	'use strict';

	var dashboard = {};

	dashboard.qodefOnDocumentReady = qodefOnDocumentReady;

	$( document ).ready( qodefOnDocumentReady );

	/**
	 *  All functions to be called on $(document).ready() should be in qodefImport function
	 **/
	function qodefOnDocumentReady() {
		qodefInitDemosMasonry.init();
		qodefDemos.init();
		qodefImport.init();
		qodefInitSingleDemo.init();
		qodefInitSingleDemo.closeDemo();
		qodefInstallPlugin.init();
		qodefSwiper.init();
	}

	/**
	 * Check element images to loaded
	 */
	var qodefWaitForImages = {
		check: function ( $element, callback ) {
			if ( $element.length ) {
				var images = $element.find( 'img' );

				if ( images.length ) {
					var counter = 0;

					for ( var index = 0; index < images.length; index++ ) {
						var img = images[index];

						if ( img.complete ) {
							counter++;
							if ( counter === images.length ) {
								callback.call( $element );
							}
						} else {
							var image = new Image();

							image.addEventListener(
								'load',
								function () {
									counter++;
									if ( counter === images.length ) {
										callback.call( $element );
										return false;
									}
								},
								false
							);
							image.src = img.src;
						}
					}
				}
			}
		},
	};

	var qodefInitDemosMasonry = {
		init: function () {
			var demosList    = $( '.qodef-import-demos' ),
				filterHolder = $( '.qodef-import-demos-list .qode-demos-filter-holder' );

			if ( demosList.length ) {
				demosList.each(
					function () {
						var thisDemoList = $( this ),
							masonry      = thisDemoList.children( '.qodef-import-demos-inner' );

						qodefWaitForImages.check(
							masonry,
							function () {
								masonry.isotope(
									{
										layoutMode: 'fitRows',
										itemSelector: 'article',
										percentPosition: true,
										masonry: {
											gutter: '.qodef-import-demos-grid-gutter',
											columnWidth: '.qodef-import-demos-grid-sizer'
										}
									}
								);

								masonry.css(
									'opacity',
									'1'
								);
								qodefDemos.init();
								qodefInitDemosMasonry.filter();
							}
						);
					}
				);
			}
		},
		filter: function () {
			var masonry = $( '.qodef-import-demos-inner' );
			$( '.qodef-import-demos-filter' ).click( function () {
					var $thisFilter  = $( this ),
						$filterValue = $thisFilter.attr( 'data-filter' );

					$thisFilter.parents().find( '.qodef-import-demos-filter' ).removeClass( 'qodef-current' );
					$thisFilter.addClass( 'qodef-current' );
					masonry.isotope( { filter: $filterValue } );
					qodefDemos.markVisibleItems( masonry );
					qodefDemos.init();
				}
			);

			// quick search regex
			var $qsRegex;
			var $quicksearch = $( '.qodef-search-demos-field' ).keyup( debounce(
				function () {
					$( '.qodef-cd-demos-filter' ).parents().find( '.qodef-import-demos-filter' ).removeClass( 'qodef-current' );
					$qsRegex = new RegExp(
						$quicksearch.val(),
						'gi'
					);
					masonry.isotope( {
						filter: function () {
							return $qsRegex ? $( this ).text().match( $qsRegex ) : true;
						}
					} );
					qodefDemos.markVisibleItems( masonry );
					qodefDemos.init();
				},
				200
			) );


			function debounce( fn, threshold ) {
				var $timeout;
				threshold = threshold || 100;
				return function debounced() {
					clearTimeout( $timeout );
					var $args = arguments;
					var $this = this;

					function delayed() {
						fn.apply(
							$this,
							$args
						);
					}

					$timeout = setTimeout(
						delayed,
						threshold
					);
				};
			}


		}
	};

	var qodefSwiper = {
		init: function () {

			var $thumbsSwiper = new Swiper(
				'.qodef-swiper-container-thumbs',
				{
					spaceBetween: 10,
					slidesPerView: 5,
					direction: 'vertical',
					touchRatio: 0.2
				}
			);

			var $mainSwiper = new Swiper(
				'.qodef-swiper-container',
				{
					slidesPerView: 1,
					effect: 'fade',
					fadeEffect: {
						crossFade: true
					},
					thumbs: {
						swiper: $thumbsSwiper,
					},
				}
			);


		}
	};

	var qodefDemos = {
		init: function () {
			var $holder = $( '.qodef-import-demos .qodef-import-demos-inner' );

			if ( $holder.length ) {
				var demos            = $holder.find( 'article' ),
					count            = demos.length,
					demo_order_array = [];

				qodefDemos.colorizeDemos( $holder.find( 'article.qodef--visible' ) );
			}
		},
		colorizeDemos: function ( demos ) {
			if ( demos.length ) {
				var itemsPerRow = qodefDemos.getNumberOfItemsPerRow( demos );
				var classToAdd;
				var oddLine     = true;
				qodefDemos.removePreviousColors( demos );
				demos.each( function ( index ) {
					var thisDemo = $( this );

					if ( itemsPerRow % 2 ) {
						classToAdd = index % 2 ? 'qodef-color2' : 'qodef-color1';
					} else {
						if ( oddLine ) {
							classToAdd = index % 2 ? 'qodef-color2' : 'qodef-color1';
						} else {
							classToAdd = index % 2 ? 'qodef-color1' : 'qodef-color2';
						}
					}

					if ( (index + 1) % itemsPerRow === 0 ) {
						oddLine = ! oddLine;
					}

					thisDemo.addClass( classToAdd );
				} );
			}
		},
		getNumberOfItemsPerRow: function ( demos ) {
			var counter           = 0;
			var firstRowOffsetTop = demos.offset().top;

			demos.each( function () {
				if ( $( this ).offset().top === firstRowOffsetTop ) {
					counter += 1;
				}
			} );

			return counter;
		},
		removePreviousColors: function ( demos ) {
			demos.each( function () {
				$( this ).removeClass( 'qodef-color1 qodef-color2' );
			} );
		},
		markVisibleItems: function ( masonry ) {
			var isotope = masonry.data( 'isotope' );
			masonry.find( 'article' ).removeClass( 'qodef--visible' );
			isotope.filteredItems.forEach( function ( item, i ) {
				$( item.element ).addClass( 'qodef--visible' );
			} );
		}

	};

	var qodefImport = {
		importDemo: '',
		importAction: '',
		importImages: 0,
		attachmentBlocks: 0,
		attachmentCounter: 0,
		totalPercent: 0,
		numberOfRequests: 1,
		nextStep: '',
		stepPercent: 0,
		init: function () {
			qodefImport.holder = $( '.qodef-import-form' );

			if ( qodefImport.holder.length ) {
				qodefImport.holder.each(
					function () {
						var qodefImportBtn    = $( '#qodef-import-demo-data' ),
							importAction      = $( '.qodef-import-option' ),
							importDemoElement = $( '.qodef-import-form .qodef-import-demo' ),
							confirmMessage    = qodefImport.holder.data( 'confirm-message' ),
							emptyImportTypeMessage    = qodefImport.holder.data( 'empty-import-type-message' );

						qodefImportBtn.on(
							'click',
							function ( e ) {
								e.preventDefault();
								qodefImport.reset();
								qodefImport.importImages = $( '.qodef-import-attachments' ).is( ':checked' ) ? 1 : 0;
								qodefImport.importDemo   = importDemoElement.val();
								qodefImport.importAction = importAction.val();

								if( qodefImport.importAction === 'none' ) {
									alert( emptyImportTypeMessage );
									return;
								}

								if ( confirm( confirmMessage ) ) {
									$( '.qodef-form-section-progress' ).show();
									$( this ).addClass( 'qodef-import-demo-data-disabled' );
									$( this ).attr(
										'disabled',
										true
									);
									qodefImport.initImportType( qodefImport.importAction );
								}
							}
						);
					}
				);
			}
		},

		initImportType: function ( action ) {
			switch (action) {
				case 'widgets':
					qodefImport.numberOfRequests = 1;
					qodefImport.countStep();
					qodefImport.importWidgets();
					break;
				case 'options':
					qodefImport.numberOfRequests = 1;
					qodefImport.countStep();
					qodefImport.importOptions();
					break;
				case 'content':
					qodefImport.nextStep         = 'terms';
					qodefImport.importContent();
					break;
				case 'complete':
					qodefImport.nextStep         = 'terms';
					qodefImport.importAll();
					break;
			}
		},

		countStep: function () {
			qodefImport.stepPercent = ( 100 / qodefImport.numberOfRequests);

		},
		setNumberOfRequests: function () {
			/**
			 * 1 - for posts, terms is not included because number is set after terms imported
			 */
			qodefImport.numberOfRequests += 1 + qodefImport.attachmentBlocks;
			if ( 'complete' === qodefImport.importAction ) {
				qodefImport.numberOfRequests += qodefImport.holder.data( 'other-files' );
			}
			qodefImport.countStep();
		},
		importWidgets: function () {
			var data = {
				action: 'widgets',
				demo: qodefImport.importDemo
			};
			qodefImport.importAjax( data );
		},

		importOptions: function () {
			var data = {
				action: 'options',
				demo: qodefImport.importDemo
			};
			qodefImport.importAjax( data );
		},

		importSettingsPages: function () {
			var data = {
				action: 'settings-page',
				demo: qodefImport.importDemo
			};
			qodefImport.importAjax( data );
		},

		importMenuSettings: function () {
			var data = {
				action: 'menu-settings',
				demo: qodefImport.importDemo
			};
			qodefImport.importAjax( data );
		},

		importContent: function () {

			if ( 'terms' === qodefImport.nextStep ) {
				qodefImport.importTerms();
			}
			if ( 'attachments' === qodefImport.nextStep ) {
				qodefImport.importAttachments();
			}
			if ( 'posts' === qodefImport.nextStep ) {
				qodefImport.importPosts();
			}
		},

		importAll: function () {

			switch (qodefImport.nextStep) {
				case 'widgets':
					qodefImport.importWidgets();
					break;
				case 'options':
					qodefImport.importOptions();
					break;
				case 'settings-pages':
					qodefImport.importSettingsPages();
					break;
				case 'menu-settings':
					qodefImport.importMenuSettings();
					break;
				default:
					qodefImport.importContent();
			}
		},
		importTerms: function () {
			var data = {
				action: 'content',
				contentType: 'terms'
			};

			qodefImport.importAjax( data );

		},
		importPosts: function () {
			var data = {
				action: 'content',
				contentType: 'posts'
			};
			qodefImport.importAjax( data );
		},

		importAttachment: function () {
			var data = {
				action: 'content',
				contentType: 'attachments',
				attachmentNumber: 1
			};
			qodefImport.importAjax( data );
		},

		importAttachments: function () {

			for ( var i = 1; i <= qodefImport.attachmentBlocks; i++ ) {
				var data = {
					action: 'content',
					contentType: 'attachments',
					attachmentNumber: i,
					images: qodefImport.importImages
				};
				qodefImport.importAjax( data );
			}
		},

		importAjax: function ( options ) {

			var defaults = {
				demo: qodefImport.importDemo,
				nonce: $( '#qodef_import_nonce' ).val()
			};
			$.extend(
				defaults,
				options
			);

			$.ajax(
				{
					type: 'POST',
					url: ajaxurl,
					data: {
						action: 'import_action',
						options: defaults
					},
					success: function ( data ) {
						var response = JSON.parse( data );
						qodefImport.ajaxSuccess(
							response,
							options
						);
					},
					error: function ( data ) {
						var response = JSON.parse( data );
						qodefImport.ajaxError(
							response,
							options
						);
					}
				}
			);
		},

		importProgress: function () {

			qodefImport.totalPercent += qodefImport.stepPercent;

			if ( 100 < qodefImport.totalPercent ) {
				qodefImport.totalPercent = 100;
			}

			$( '#qodef-progress-bar' ).val( Math.round( qodefImport.totalPercent ) );
			$( '.qodef-progress-percent' ).html( Math.round( qodefImport.totalPercent ) + '%' );

			if ( 100 === Math.round( qodefImport.totalPercent ) ) {
				$( '#qodef-import-demo-data' ).remove( '.qodef-import-demo-data-disabled' );
				$( '.qodef-import-is-completed' ).show();
			}
		},

		ajaxSuccess: function ( response, options ) {

			if( typeof response.status !== 'undefined' && response.status == 'success' ) {
				if ( options.action === 'content' ) {

					switch (options.contentType) {
						case 'terms':
							qodefImport.proccedTermsResponse( response );
							break;
						case 'attachments':
							qodefImport.proccedAttachmentsResponse( response );
							break;
						case 'posts':
							qodefImport.proccedPostsResponse( response );
							break;
					}
				} else if ( 'complete' === qodefImport.importAction ) {

					switch (options.action) {
						case 'options':
							qodefImport.nextStep = 'widgets';
							qodefImport.importAll();
							break;
						case 'widgets':
							qodefImport.nextStep = 'menu-settings';
							qodefImport.importAll();
							break;
						case 'menu-settings':
							qodefImport.nextStep = 'settings-pages';
							qodefImport.importAll();
							break;
						case 'settings-pages':
							qodefImport.nextStep = '';
							break;
					}

				}

				qodefImport.importProgress();
			} else {
				qodefImport.holder.find( '#qodef-import-demo-data' ).remove( '.qodef-import-demo-data-disabled' );
				qodefImport.holder.find( '.qodef-import-went-wrong' ).show();
			}
		},

		ajaxError: function ( response, options ) {
			console.log( 'error' );
			console.log( response );
		},

		proccedTermsResponse: function ( response ) {

			if ( typeof response.data.number_of_blocks !== 'undefined' ) {
				qodefImport.attachmentBlocks = response.data.number_of_blocks;
				qodefImport.nextStep         = 'attachments';

				qodefImport.setNumberOfRequests();
			}
			qodefImport.importContent();
		},

		proccedAttachmentsResponse: function ( response ) {
			if ( typeof response.data.attachment_block !== 'undefined' ) {
				qodefImport.attachmentCounter++;
			}

			if ( qodefImport.attachmentCounter === qodefImport.attachmentBlocks ) {
				qodefImport.nextStep = 'posts';
				qodefImport.importContent();
			}
		},

		proccedPostsResponse: function ( response ) {

			if ( 'complete' === qodefImport.importAction ) {
				qodefImport.nextStep = 'options';
				qodefImport.importAll();
			}

		},

		reset: function () {
			qodefImport.totalPercent = 0;
			$( '#qodef-progress-bar' ).val( 0 );
		}
	};

	var qodefInitSingleDemo = {
		mainURL: '',
		singleHolder: '',
		contentHolder: '',
		init: function () {
			var $container       = $( '.qodef-import-demos-inner' ),
				$demoImportLinks = $container.find( '.qodef-import-demo-link' ),
				nonceHolder      = $container.find( '#qode_essential_addons_demo_import_nonce' );

			qodefInitSingleDemo.mainURL       = qodefInitSingleDemo.clearURL( window.location.href );
			qodefInitSingleDemo.singleHolder  = $( '.qodef-demo-single' );
			qodefInitSingleDemo.contentHolder = $( '.qodef-admin-demos-content ' );

			$demoImportLinks.on(
				'click',
				function ( e ) {
					e.preventDefault();
					var $demo = $( this ),
						$demoID;

					if ( typeof $demo.data( 'demo-id' ) !== 'undefined' && $demo.data( 'demo-id' ) !== '' ) {
						$demoID = $demo.data( 'demo-id' );
					}

					$.ajax( {
						type: 'POST',
						url: ajaxurl,
						data: {
							action: 'open_demo_single',
							demoId: $demoID,
							nonce: nonceHolder.val()
						},
						success: function ( data ) {
							var response = JSON.parse( data );
							qodefInitSingleDemo.openDemo(
								response.data,
								$demoID
							);
							qodefInitSingleDemo.closeDemo();
							qodefImport.init();
							qodefInstallPlugin.init();
							qodefSwiper.init();
							qodefFramework.select2.init();
						},
						error: function ( data ) {
							// var response = JSON.parse(data);
							// qodefImport.ajaxError(response, options);
						}
					} );
				}
			);
		},
		changeURL: function ( $url ) {
			history.pushState(
				'',
				'',
				$url
			);
		},
		addParamsToURL: function ( $params ) {
			var $query             = { 'demo-id': $params },
				$currentUrl        = qodefInitSingleDemo.mainURL,
				$urlParamSeparator = (window.location.href.indexOf( '?' ) === -1) ? '?' : '&',
				$newUrl            = $currentUrl + $urlParamSeparator + decodeURIComponent( $.param( $query ) );
			qodefInitSingleDemo.changeURL( $newUrl );
		},
		removeParamsFromURL: function () {

			var $url = window.location.href;

			var $cleanURL = qodefInitSingleDemo.clearURL( $url );
			qodefInitSingleDemo.changeURL( $cleanURL );

		},
		clearURL: function ( $url ) {

			var $parameter = 'demo-id';

			var $urlParts = $url.split( '?' );
			if ( $urlParts.length >= 2 ) {

				var $prefix = encodeURIComponent( $parameter ) + '=';
				var $pars   = $urlParts[1].split( /[&;]/g );

				//reverse iteration as may be destructive
				for ( var i = $pars.length; i-- > 0; ) {
					//idiom for string.startsWith
					if ( $pars[i].lastIndexOf(
						$prefix,
						0
					) !== -1 ) {
						$pars.splice(
							i,
							1
						);
					}
				}
				return $urlParts[0] + ($pars.length > 0 ? '?' + $pars.join( '&' ) : '');
			}

			return $url;

		},
		openDemo: function ( data, $demoID ) {
			qodefInitSingleDemo.contentHolder.addClass( 'qodef-demo-import-single-opened' );
			qodefInitSingleDemo.singleHolder.html( data );
			qodefInitSingleDemo.addParamsToURL( $demoID );
		},
		closeDemo: function ( data ) {

			var $closeButton = $( '.qodef-return-to-demo-list' );

			if ( $closeButton.length ) {
				$closeButton.on(
					'click',
					function ( e ) {
						e.preventDefault();
						qodefInitSingleDemo.contentHolder.removeClass( 'qodef-demo-import-single-opened' );
						qodefInitSingleDemo.singleHolder.html();
						qodefInitSingleDemo.removeParamsFromURL();
						qodefInitDemosMasonry.init();
					}
				);
			}

		}
	};

	var qodefInitRemovePopup = {
		init: function () {
			var body            = $( 'body' ),
				demoImportPopup = $( '#qodef-demo-import-popup' ),
				closeButton     = demoImportPopup.find( '.qodef-import-popup-close' );

			if ( closeButton.length ) {
				closeButton.on(
					'click',
					function ( e ) {
						e.preventDefault();
						demoImportPopup.remove();
						body.removeClass( 'qodef-demo-import-popup-opened' );
					}
				);
			}

		}
	};

	var qodefInstallPlugin = {
		init: function () {
			$( '.qodef-required-plugins-holder' ).on(
				'click',
				'.qodef-install-plugin-link',
				function ( e ) {
					e.preventDefault();
					var $link         = $( this ),
						$allLinks     = $link.parents( '.qodef-required-plugins-holder' ).find( '.qodef-install-plugin-link' ),
						$pluginAction = 'install',
						$pluginActionLabel = '',
						$pluginSlug   = '';

					$allLinks.addClass( 'qodef-disabled' );
					$link.removeClass( 'qodef-disabled' );
					$link.next( '.qodef-plugin-installing-spinner' ).addClass( 'active' );

					if ( typeof $link.data( 'plugin-action' ) !== 'undefined' && $link.data( 'plugin-action' ) !== '' ) {
						$pluginAction = $link.data( 'plugin-action' );
					}

					if ( typeof $link.data( 'plugin-action-label' ) !== 'undefined' && $link.data( 'plugin-action-label' ) !== '' ) {
						$pluginActionLabel = $link.data( 'plugin-action-label' );
					}

					if ( typeof $link.data( 'plugin-slug' ) !== 'undefined' && $link.data( 'plugin-slug' ) !== '' ) {
						$pluginSlug = $link.data( 'plugin-slug' );
					}

					$link.text( $pluginActionLabel );

					jQuery.ajax(
						{
							type: 'POST',
							url: ajaxurl,
							data: {
								action: 'install_plugin',
								pluginAction: $pluginAction,
								pluginSlug: $pluginSlug
							},
							success: function ( data ) {
								var $response = JSON.parse( data );

								if ( $pluginAction === 'install' ) {
									if ( $response.status === 'success' ) {
										$link.next( '.qodef-plugin-installing-spinner' ).removeClass( 'active' );
										$link.text( $response.message );
										$link.data(
											'plugin-action',
											'activate'
										);
										$link.data(
											'plugin-action-label',
											$response.data.action_label
										);
									}
								} else {
									if ( $response.status === 'success' ) {
										$link.next( '.qodef-plugin-installing-spinner' ).removeClass( 'active' );
										$link.addClass( 'qodef-disabled' );
										$link.text( $response.message );
										$link.attr(
											'data-plugin-action',
											'activated'
										);
									}
								}

								$allLinks.removeClass( 'qodef-disabled' );
							},
							error: function () {

							}
						}
					);
					return false;
				}
			);
		}
	};
})( jQuery );
