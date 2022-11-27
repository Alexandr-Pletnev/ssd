$(function($) {

    'use strict';

    /*-----------------------------------------------------------------
     * Variables
     *-----------------------------------------------------------------*/

    var $body_html = $('body, html'),
        $html = $('html'),
        $body = $('body'),

        $navigation = $('#navigation'),
        navigation_height = $navigation.height() - 20,

        $scroll_to_top = $('#scroll-to-top'),

        $preloader = $('#preloader'),
        $loader = $preloader.find('.loader');

    if (navigation_height <= 0) navigation_height = 60;

    /*-----------------------------------------------------------------
     * Is mobile
     *-----------------------------------------------------------------*/

    var ua_test = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
        is_mobile = ua_test.test(navigator.userAgent);

    $html.addClass(is_mobile ? 'mobile' : 'no-mobile');

    /*-----------------------------------------------------------------
     * Background Parallax
     *-----------------------------------------------------------------*/

    $.stellar({
        responsive: true,
        horizontalOffset: 0,
        verticalOffset: 0,
        horizontalScrolling: false,
        hideDistantElements: false
    });

    /*-----------------------------------------------------------------
     * ScrollSpy
     *-----------------------------------------------------------------*/

    $body.scrollspy({
        offset:  51,
        target: '#navigation'
    });

    /*-----------------------------------------------------------------
     * Affixed Navbar
     *-----------------------------------------------------------------*/

    $('.affix').affix({
        offset: {
            top: navigation_height
        }
    });

    /*-----------------------------------------------------------------
     * Dropdown By Click on Mobile
     *-----------------------------------------------------------------*/

    if (is_mobile) {
        $('.dropdown-toggle').each(function() {
            $(this).attr('data-toggle', 'dropdown');
        });
    }

    /*-----------------------------------------------------------------
     * Scroll To Top
     *-----------------------------------------------------------------*/

    $(window).scroll(function () {

        var $scroll_top = $(this).scrollTop();

        if ($scroll_top > navigation_height) {
            $scroll_to_top.addClass('in');
        } else {
            $scroll_to_top.removeClass('in');
        }
    });

    $scroll_to_top.click(function() {
        $.scrollWindow(0);
    });

    /*-----------------------------------------------------------------
     * Smooth Scrolling
     *-----------------------------------------------------------------*/

    $('a[href^="#"]').click(function(event) {

        event.preventDefault();

        var $this = $(this),
            target = $this.attr('href');

        // Don't return false!
        if (target == '#') return;

        if ($this.hasClass('smooth-scroll')) {
            var offset = $(target).offset().top - navigation_height;
            $.scrollWindow(offset);
        }
    });

    $.scrollWindow = function(offset) {
        $body_html.animate({
            scrollTop: offset
        }, 1500);
    };

    /*-----------------------------------------------------------------
     * Animation
     *-----------------------------------------------------------------*/

    // Init WOW
    new WOW().init({ mobile: false });

    // Animate Numbers
    var $animate_number = $('.animate-number');

    if ($animate_number.length > 0) {

        $animate_number.appear();

        $body.on('appear', '.animate-number', function () {
            $animate_number.each(function () {
                var $this = $(this);
                if (!$this.hasClass('animate-stop')) {
                    $this.animateNumber({
                        number: $this.attr("data-value")
                    }, 750);
                    $this.addClass('animate-stop');
                }
            });
        });
    }

    /*-----------------------------------------------------------------
     * Magnific
     *-----------------------------------------------------------------*/

    $('.image-popup').magnificPopup({
        closeBtnInside : true,
        type           : 'image',
        mainClass      : 'mfp-with-zoom'
    });

    $('.iframe-popup').magnificPopup({
        type      : 'iframe',
        mainClass : 'mfp-with-zoom'
    });

    /*-----------------------------------------------------------------
     * Carousels
     *-----------------------------------------------------------------*/

    $(".img-carousel").owlCarousel({
        pagination        : true,
        navigation        : false,
        responsive        : true,
        singleItem        : true,
        transitionStyle   : 'fadeUp',
        navigationText    : [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ]
    });

    $("#carousel-home").owlCarousel({
        pagination        	  : false,
        navigation            : true,
        responsive            : true,
        singleItem            : true,
        autoHeight            : true,
		loop:true,
        transitionStyle       : 'fadeUp',
        navigationText    : [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ]
    });

    $("#carousel-our-team").owlCarousel({
        pagination        : false,
        navigation        : false,
        responsive        : true,
        items             : 5
    });

    $("#carousel-testimonials").owlCarousel({
        pagination        : false,
        navigation        : false,
        responsive        : true,
        items             : 4,
        itemsDesktop 	  : [1199, 4],
        itemsDesktopSmall : [991,2],
        itemsMobile 	  : [590,1]
    });

    $("#carousel-clients").owlCarousel({
        pagination        : false,
        navigation        : false,
        responsive        : true,
		loop:true,
        items             : 4,
        autoPlay			  : 3000,
		stopOnHover			  : false
    });

    $("#carousel-projects").owlCarousel({
        pagination        : false,
        navigation        : false,
        responsive        : true,
        items             : 4,
        itemsDesktop 	  : [1199, 4],
        itemsDesktopSmall : [991,2],
        itemsMobile 	  : [590,1]
    });


    /*-----------------------------------------------------------------
     * Ajax forms
     *-----------------------------------------------------------------*/

    $('.form-ajax').each(function(){

        $(this).validate({
            submitHandler: function(form) {

                var $submit_button = $(form).find('[type=submit]'),
                    submit_button_text = $submit_button.html();

                $submit_button.attr('disabled', true);
                $submit_button.html('Please wait...');

                var ret_code = true;
				var f1_Name = $(form)[0][1].value;
				var f2_Contact = $(form)[0][2].value;
				var f3_Type = $(form)[0][0].value;
				var f4_Message = $(form)[0][3].value;

				//Send data to Google form
				$.ajax({

                    type   : 'post',
                    url    : 'https://docs.google.com/forms/d/e/1FAIpQLSdjfPoXShXYnwyadN7txDnnBCsHRWHnxg8RlbBg-JM32cuU9g/formResponse',
                    data   : {'entry.1817750496' : f1_Name, 'entry.1758635658' : f2_Contact, 'entry.159100398': f3_Type, 'entry.2130411132': f4_Message},
					dataType: 'xml',
                    statusCode: {
                        0: function() {
                            //Success message
							ret_code = true;
                        },
                        200: function() {
                            //Success Message
							ret_code = true;
                        }
                    }
                });
				
				if (ret_code)
				{
                        $('.result-icon .icon').removeClass('fa-times').addClass('fa-check');
                        $('.modal-result').html('Сообщение успешно отправлено :)');

                        $('.modal.in').modal('hide');
                        $('#result').modal('show');

                        $submit_button.attr('disabled', false);
                        $submit_button.html(submit_button_text);
				}
				else
				{
                        $('.result-icon .icon').removeClass('fa-check').addClass('fa-times');
                        $('.modal-result').html('Error sending message :(');

                        $('.modal.in').modal('hide');
                        $('#result').modal('show');

                        $submit_button.attr('disabled', false);
                        $submit_button.html(submit_button_text);
				};
				
				//Send data to Bitrix24
				//prepare datas
				var f5_email = "";
				var f5_phonem = "";
				var f5_phoneo = "";
				if (f2_Contact.includes('@'))
				{
					//this is email
					f5_email = f2_Contact;
				}
				else if (/[a-zA-Z]/i.test(f2_Contact))
				{
					//this is text
					f5_phoneo = f2_Contact;
				}
				else
				{
					//this is phone
					f5_phonem = f2_Contact;
				}
				//post request
				$.ajax({

                    type   : 'post',
                    url    : 'https://algosmart.bitrix24.ru/crm/configs/import/lead.php',
                    data   : {'LOGIN' : 'lidb24@algosmart.ru', 'PASSWORD' : 'H5wOhm', 'TITLE': f1_Name,
							  'COMMENTS': 'form-' + f3_Type + '; message-' + f4_Message, 'STATUS_ID' : 'NEW',
							  'SOURCE_ID' : 'WEB', 'CURRENCY_ID' : 'RUB', 'PRODUCT_ID' : 'OTHER', 'ASSIGNED_BY_ID' : 1,
							  'EMAIL_OTHER' : f5_email, 'PHONE_OTHER' : f5_phoneo, 'PHONE_MOBILE' : f5_phonem},
					dataType: 'xml'
                });
				yaCounter43888244.reachGoal('NEWLEAD');
                /*
				$.ajax({

                    type   : 'post',
                    url    : 'sendmail.php',
                    data   : $(form).serialize(),

                    success: function() {

                        $('.result-icon .icon').removeClass('fa-times').addClass('fa-check');
                        $('.modal-result').html('Message sent successfully :)');

                        $('.modal.in').modal('hide');
                        $('#result').modal('show');

                        $submit_button.attr('disabled', false);
                        $submit_button.html(submit_button_text);
                    },

                    error: function(){

                        $('.result-icon .icon').removeClass('fa-check').addClass('fa-times');
                        $('.modal-result').html('Error sending message :(');

                        $('.modal.in').modal('hide');
                        $('#result').modal('show');

                        $submit_button.attr('disabled', false);
                        $submit_button.html(submit_button_text);
                    }
                });*/
            }
        });
    });

    // Left Body Padding Fix
    $('.modal').on('hide.bs.modal', function (e) {
        var $body = $('body');
        if (parseInt($body.css('padding-right')) > 0) {
            $body.css('padding-right', '');
        }
    });

    /*-----------------------------------------------------------------
     * Google Maps
     *-----------------------------------------------------------------*/

    if ($('#map-canvas').length > 0) {

        var lat_lng = new google.maps.LatLng(-37.85787, 144.5191615),
            map_center = new google.maps.LatLng(-37.728687, 145.162939),
            //hue ='#ff5555',
            marker_title = 'Company Name',
            marker_information =
                '<div id="map-window">' +
                '<h4>We are here!</h4>' +
                '</div>';


        // map settings
        var settings = {
            zoom          : 9,
            center        : map_center,
            mapTypeControl: false,
            mapTypeId     : google.maps.MapTypeId.ROADMAP,
            styles        : [
                {
                    //stylers: [
                    //    { hue: hue },
                    //    { saturation: -20 }
                    //]
                }, {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers    : [
                        { lightness: 100 },
                        { visibility: 'simplified' }
                    ]
                }, {
                    featureType: 'road',
                    elementType: 'labels',
                    stylers    : [
                        { visibility: 'off' }
                    ]
                }
            ]
        };

        // create map
        var map = new google.maps.Map(document.getElementById('map-canvas'), settings);

        // map marker (see global)
        var marker = new google.maps.Marker({
            position: lat_lng,
            map: map,
            title: marker_title
        });

        // tooltip
        var info_window = new google.maps.InfoWindow({
            content: marker_information
        });

        // open tooltip
        info_window.open(map, marker);
    }
	
    /*-----------------------------------------------------------------
     * Load image after main page
     *-----------------------------------------------------------------*/

    function PostLoadImages()
    {
        var $this, src, images;

		images = $('img[data-src]');
        images.each(function(){
			$this = $(this);
			src = $this.data('src');
			$this.attr('src', src);
		});

		try {
			images.preload(function(){
				$(this).show();
			});
		}
		catch(err) {
			//console.log(err);
		}
       // $('#mainFormSection').css("background-image","url(images/join-now.jpg)");
        
    }

    /*-----------------------------------------------------------------
     * URL manipulation
     *-----------------------------------------------------------------*/

	 function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			if (value.includes("#")) {
				value = value.substr(0, value.indexOf("#"));
			};
			
			vars[key] = value;
		
		});
		return vars;
	}
	
	function getUrlVarsUrl(name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(url);
		return results == null ? null : results[1];
	}

    /*-----------------------------------------------------------------
     * Cookies and Header manipulation
     *-----------------------------------------------------------------*/

	 function CookiesAndHeader() {
        /* Change H1 for UTP */

		//var utp = getUrlVars()["utp"];
		var utp = getUrlVarsUrl('utp');
		var header_out = "";

        /* Cookies manipulation */
		//console.log("url value:" + utp);
		//console.log("cookie get:" + Cookies.get('utp'));
		if (typeof utp !== 'undefined' && utp !=null && Cookies.get('utp') != utp) {
			Cookies.set('utp', utp.toLowerCase());
			//console.log('cookie set:' + Cookies.get('utp'));
		}
		utp = Cookies.get('utp');
		//console.log("final:" + utp);
		
        /* Change H1 for UTP (continue)*/
		switch(utp) {
			case "load":
				header_out = "ЗАГРУЗКА WINDOWS МЕНЕЕ 15 СЕКУНД!";
			break;
			case "fast":
				header_out = "УСКОРЬ НОУТБУК в 4 РАЗА!";
			break;
			case "buy":
				header_out = "НОУТБУК ЗА 25% ЦЕНЫ";
			break;
			default:
				header_out = "ЗАГРУЗКА WINDOWS МЕНЕЕ 15 СЕКУНД!";
		}
		$('#h1first').text(header_out);
	 }

	 /*-----------------------------------------------------------------
     * Modal window for Reklama
     *-----------------------------------------------------------------*/
	 function ModalWindowReklama() {
		if (!$.cookie('hideModal')) {
			var delay_popup = 5000;
			setTimeout("document.getElementById('overlay').style.display='block'", delay_popup);
		}
		// Запоминаем в куках, что посетитель уже заходил
		$.cookie('hideModal', true);
	 }
	 
    /*-----------------------------------------------------------------
     * Finish loading
     *-----------------------------------------------------------------*/
	
	$(window).load(function() {
		
		//CookiesAndHeader();
		
        /* Remove preloader */

        $loader.delay(1500).fadeOut();
        $preloader.delay(500).fadeOut('slow');

        $body.addClass('loaded');

        PostLoadImages();

    });

	$(document).ready(function() {
		
		CookiesAndHeader();
        //setTimeout("document.getElementById('overlay').style.display='block'", 10000);

    });

});
