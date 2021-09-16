var loadAjax = false; // Идет ли загрузка
var loadAjaxListing = true;
var searchTimer = null;
var msg_index = 0;

// FILTER MOB //
let filterStatus = false;

$(document).ready(function(){
	$(document).mouseup(function (e){ // событие клика по веб-документу
		var div = $(".search_results"); // тут указываем ID элемента
		if (!div.is(e.target) // если клик был не по нашему блоку
		    && div.has(e.target).length === 0) { // и не по его дочерним элементам
			div.removeClass('active'); // скрываем его
		}
		var div = $(".cat-wrap");
		if (!div.is(e.target)
		    && div.has(e.target).length === 0) {
			div.removeClass('menu-opened');
		}
	});

    $('#nav-mobile .mobile_toggler').click(function() {
        $('#nav-mobile').toggleClass('nav-mobile')
        $('#container').toggleClass('nav-mobile')
        $('#mobile-menu').toggleClass('nav-mobile').css('left', 'unset')
    })

    $('#mobile-menu .mobile-menu_back').click(function() {
        $('#nav-mobile').toggleClass('nav-mobile')
        $('#container').toggleClass('nav-mobile')
        $('#mobile-menu').toggleClass('nav-mobile')
    })

	$(".filter-search").keyup(function () {
        var filter = $(this).val();
        $(this).parent().find(".filter-checkbox").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    });
	$("#brands-slider").slick({
		infinite: true,
		slidesToShow: 6,
		slidesToScroll: 1,
		dots: false,
		arrows: true,	
		autoplay: true,
		autoplaySpeed: 5000,
		responsive: [
		    {
				breakpoint: 1400,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 5,
				}
		    },
		    {
				breakpoint: 990,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4,
				}
		    },
			{
				breakpoint: 750,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					arrows: false,
				}
			}
		]
	});

    $('#collection-cat_wrap .collection-cat_gallery').slick({
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 5000
	});

	$("#popular .product-slider").slick({
        adaptiveHeight: true,
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 2,
		dots: false,
		arrows: true,	
		autoplay: true,
		autoplaySpeed: 5000,
		responsive: [
		    {
				breakpoint: 1400,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
				}
		    },
		    {
				breakpoint: 990,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				}
		    },
			{
				breakpoint: 750,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
				}
			}
		]
	});	

	$("#popular .popular-category").click(function(){
		if(!$(this).hasClass("active")){
			$("#popular .popular-category").removeClass("active");
			$(this).addClass("active");
			$("#popular .product-slider").removeClass("active");
			$("#popular #"+$(this).attr("data-slider")).addClass("active");
		}
	});

	$("#faq .faq .faq-question").click(function(){
		$(this).closest(".faq").toggleClass("active");
		$(this).closest(".faq").find(".faq-answer").toggle();
	});

	$("#help-form input").on("input", function() {
		$(this).closest("label").toggleClass("active", $(this).val() !== "");
	});

	$('#buy-one-click').click(function(){
		$('#1-click').toggle();
	});

	$('.vendor-name').click(function(){
		$(this).next('.vendor-info').toggle();
	})
	
	$('.help-block').click(function(event){
		event.preventDefault();
		$('#1-click').show();
	});

    // SEARCH MAIN //
	$('.nav-menu form').on('submit', function(){
		window.location.href = '/search/'+$('.nav-menu input[type=search]').val();
		return false;
	})

	$('#nav input[type="search"]').on('keyup', function(){
		if($(this).val().length >= 3){
			clearTimeout(searchTimer); 
			searchTimer = setTimeout(ajaxSearch, 300)
		}else{$('#nav .search_results').removeClass('active');}
	})

	// CART //
	$('.cart-return').click(function(e){
		e.preventDefault();
		$('.popup').toggle();
	});
	$('.price-block_delete').click(function(){
		cart_add($(this).closest('.cart-item').attr('data-id'),0, function(){});
		$(this).closest('.cart-item').fadeOut(250, function(){ $(this).remove();});
	});
	$('.clear-cart').click(function(){
		cart_add('all', 0, function(){});
		$('.cart-item').not('.cart-delivery').fadeOut(250, function(){ $(this).remove();});
		$('.cart-total span').html('0.00');
	});

    // Menu
    $('#nav .catalog_toggler').on('click', function() {
        $('#nav .catalog_container').toggle()
    })

    $('#nav .catalog_category').hover(function() {
        $('#nav .catalog_category').removeClass('active')
        $(this).addClass('active')
    })

	// PRODUCT QUANTITY //
	$('.quantity-plus').click(function(){
		$(this).prev('input').val( function(i, oldval){
			return parseInt( oldval, 10) + 1;
		});
	});
	
	$('.quantity-minus').click(function(){
		if($(this).next('input').val() > 1){
			$(this).next('input').val( function(i, oldval){
				return parseInt( oldval, 10) - 1;
			});
		}
	});

	// TO TOP //
	$(window).scroll(function(){
		$("#to-top").toggleClass("active", ($(this).scrollTop() >= $(this).height()));
		$("#to-top").toggleClass("bottom", ($(window).scrollTop() >= $("body").height() - 1.5*$(window).height()));
	});

	$("#to-top").click(function(){
		$("html, body").animate({scrollTop: 0}, 1000);
		console.log("scroll");
	});

	// POPUP //
	$(".popup").on("click", ".background, .close", function(){
		$(this).closest(".popup").fadeOut("500");
	});

    // Выпадающий список опций
    $('.custom-dropdown').click(function(){
        $('.custom-dropdown_options').toggle();
        $('.custom-dropdown_title').toggleClass('active');
    });

    $('.custom-dropdown_option').on('click', function(){
        $('.custom-dropdown_title').text($(this).text());
    });

	$(window).resize(function() {
		if($(window).width() > 990){
			closeFilter();
		}
	});

	// RANGE FILTER //
	$(".filter-slider .range-slider").ionRangeSlider({
		skin: "round",
		type: "double",
		grid: false,
		grid_num: 1,
        prettify_enabled: true,
        values_separator: ' - ',
        hide_min_max: true,
        hide_from_to: true,
        drag_interval: true,
		onStart: updateFilterRange,
		onChange: updateFilterRange,
		onFinish: updateFilterRangeFinish
	});

	function updateFilterRange (data) {
		let from = data.from;
		let to = data.to;
		const $slider = data.slider;
		const $input_from = $slider.closest(".filter-slider").find(".range-from");
		const $input_to = $slider.closest(".filter-slider").find(".range-to");

		$input_from.val(from);
		$input_to.val(to);
	}

	function updateFilterRangeFinish(data){
		updateFilterRange(data);
		//alert(data.slider.closest(".filter-slider").attr('data-type'));
		filter_go();
	}

	$(".filter-slider .range-from").on("change", function () {
		let val = parseInt($(this).val());
		const slider = $(this).closest(".filter-slider").find(".range-slider").data("ionRangeSlider");
		const min = slider.result.min;
		const max = slider.result.max;

		if (val < min) {
			val = min;
		} else if (val > max) {
			val = max;
		}
		else if(val > slider.result.to){
			val = slider.result.to;
		}

		slider.update({
			from: val
		});
		$(this).val(val);
	});

	$(".filter-slider .range-to").on("change", function () {
		let val = parseInt($(this).val());
		const slider = $(this).closest(".filter-slider").find(".range-slider").data("ionRangeSlider");
		const min = slider.result.min;
		const max = slider.result.max;

		if (val < min) {
			val = min;
		} else if (val > max) {
			val = max;
		}
		else if(val < slider.result.from){
			val = slider.result.from;
		}

		slider.update({
			to: val
		});
		$(this).val(val);
	});

	// FILTER DROPDOWN //
	$("#filter .filter-toggle .filter-header").on("click", function (){
		let $parent = $(this).closest(".filter-toggle");
		$parent.toggleClass("filter-close").toggleClass("filter-open");
	});

	// PRODUCT PICTURES //
	$("#product .product-pictures-slider").slick({
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		dots: false,
		arrows: true,
		fade: false,
		asNavFor: '#product .product-pictures-slider-preview',
		responsive: [
			{
				breakpoint: 990,
				settings: {
                    arrows: false,
                    dots: true
				}
			},
			{
				breakpoint: 750,
				settings: {
					arrows: false,
				}
			}
		]
	});

	$("#product .product-pictures-slider-preview").slick({
		infinite: false,
		slidesToShow: 6,
		slidesToScroll: 1,
		dots: false,
		arrows: false,
		asNavFor: '#product .product-pictures-slider',
		focusOnSelect: true,
		responsive: [
			{
				breakpoint: 990,
				settings: {
					slidesToShow: 8,
					arrows: false,
					swipeToSlide: true,
                    asNavFor: false
				}
			},
			{
				breakpoint: 750,
				settings: {
					slidesToShow: 4,
					arrows: false,
					swipeToSlide: true
				}
			}
		]
	});

	$("#product .product-pictures-slider-preview").on('init reInit breakpoint', function(event, slick){
		const slideCount = slick.slideCount;
		let slidesToShow = slick.options.slidesToShow;
		const w = $(window).width();
		const breakpoints = slick.breakpoints;
		breakpoints.forEach((size) => {
			if(size >= w){
				slidesToShow = slick.breakpointSettings[size].slidesToShow;
			}
		});

		slick.$slideTrack.toggleClass("unsetScroll",(slidesToShow >= slideCount));
	});

	// RELATED PRODUCTS IN PRODUCT PAGE //
	$("#product .products-related .product-slider").slick({
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 4,
		dots: false,
		arrows: true,
		autoplay: true,
		autoplaySpeed: 5000,
		responsive: [
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
                    arrows: false,
				}
			},
			{
				breakpoint: 990,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 750,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});

	// SELECT PLACEHOLDER //
	$(".styled-select select").on("change", function (){
		$(this).removeClass("select-placeholder");
		$(this).find("option[disabled]").remove();
	});

	// CHECKOUT TABS //
	$("#checkout-page .checkout-types .checkout-type").on("click", function (){
		if( $(this).hasClass("active") ) return;
		const type = $(this).attr('data-type');
		$("#checkout-page .checkout-types .checkout-type").removeClass("active");
		$(this).addClass("active");
		$("#checkout-page .checkout-type-box").css("display", "none");
		$("#checkout-page .checkout-type-box[data-type="+type+"]").css("display", "flex");
	});

	// INPUT MASK //
	$("input.phone_mask").inputmask({
		mask: '+7(999)999-99-99'
	});
	$("input.date_mask").inputmask({
		alias: 'datetime',
		inputFormat: "dd/mm/yyyy",
		placeholder: "дд/мм/гггг"
	});
	$("input.time_mask").inputmask({
		alias: 'datetime',
		inputFormat: "HH:MM",
		placeholder: "чч:мм"
	});

	$('#select-sort .custom-dropdown_option').click(function(){
		filter_set('sort', $(this).attr('data-value'));
		filter_go();
	});
	
	$(".filter .range-inputs input").change(function(){
		filter_go();
	});

	if(scrollingEnabled)initScrollingLoad();

	$(".filter-checkboxes.filter-one input[type=checkbox]").change(function(){
		filter_go();
	});
	
	$(".filter-checkboxes.filter-two input[type=checkbox]").change(function(){
		filter2_go();
	});

	$(".filter-reset-btn.reset-one").click(function(){ //Сброс фильтров
		$(".filter-slider").each(function(){
			$(this).find('.range-slider').data("ionRangeSlider").update({
				from: 0,
				to: $(this).find('.range-slider').attr("data-max")
			});
			$(this).find('.range-from').val(0);
			$(this).find('.range-to').val($(this).find('.range-slider').attr("data-max"));
		});
		$(".filter-checkboxes input[type=checkbox]").prop('checked', false);
		filter_go();
	});


	$(".filter-reset-btn.reset-two").click(function(){ //Сброс фильтров
		$(".filter-checkboxes input[type=checkbox]").prop('checked', false);
		filter2_go();
	});

	$("div.pass-recovery").on('click', function(){
		$(".login-block").hide();
		$(".recovery-block").show();
	});

	$(".frm-change-password").on('submit', function(){
		var password_old = $(".frm-change-password input[name=password_old]").val();
		var password_new = $(".frm-change-password input[name=password_new]").val();
		var password_new2 = $(".frm-change-password input[name=password_new2]").val();

		if(password_new == password_new2){
			$('.products-list').toggleClass('loader-blur');
			if($('.login-block').find('input[type=checkbox]').prop("checked")){psave = 1;}
			$.post('/user-personal', $(this).serialize(), function(data, textStatus) {
				if(data.status == 'ok'){
					push_msg('green', 'Пароль успешно изменен');
				}else{
					push_msg('red', 'Неверно указан старый пароль');
				}
				$('.products-list').toggleClass('loader-blur');
			}, "json");
		}else{
			push_msg('red', 'Пароли не совпадают');
		}
		return false;
	});

	$(".login-block form").on('submit', function(){
		$('.products-list').toggleClass('loader-blur');
		var psave = '0';
		if($('.login-block').find('input[type=checkbox]').prop("checked")){psave = 1;}
		$.post('/login?save='+psave, $(this).serialize(), function(data, textStatus) {
			if(data.status == 'ok'){
				window.location.href = '/user-personal';
			}else{
				push_msg('red', 'Неверный E-Mail или пароль');
			}
			$('.products-list').toggleClass('loader-blur');
		  }, "json");
		return false;
	});

	$(".recovery-block button").on('click', function(){
		$('.products-list').toggleClass('loader-blur');
		if(isEmail($(".recovery-block input[type=email]").val())){
		$.post('/login', { ajax: "recovery", email: $(".recovery-block input[type=email]").val() }, function(data, textStatus) {
			if(data.status == 'ok'){
				push_msg('green', 'На Ваш E-Mail отправлен новый пароль');
				$(".recovery-block").hide();
				$(".srecovery-block").show();
			}else{
				push_msg('red', 'Неверный E-Mail');
			}
			$('.products-list').toggleClass('loader-blur');
			}, "json");
		}else{push_msg('red', 'Введите E-Mail');}
	});

	$(".srecovery-block button").on('click', function(){
		$(".login-block input[type=email]").val($(".recovery-block input[type=email]").val());
		$(".srecovery-block").hide();
		$(".login-block").show();
	});

	$('.reg-block form').on('submit', function(){
		if($('.regist-footer_privacy input[type=checkbox]').prop("checked")){
			$('.products-list').toggleClass('loader-blur');
			$.post('/registration', $(this).serialize(), function(data, textStatus) {
				if(data.status == 'ok'){
					$('#regist-page').hide();
					$('#regconf-page').show();
				}else{
					push_msg('red', 'Пользователь с таким E-Mail уже зарегистрирован');
				}
				$('.products-list').toggleClass('loader-blur');
			}, "json");
		}else{
			push_msg('red', 'Чтобы продолжить регистрацию, вы должны согласиться с нашей политикой конфиденциальнсти');
		}
		return false;
	});

	$(".btn-go-profile").on('click', function(){
		window.location.href = '/user-personal';
	});
	
	$('#regconf-page form').on('submit', function(){
		$('.products-list').toggleClass('loader-blur');
		$.post('/registration', $(this).serialize(), function(data, textStatus) {
			if(data.status == 'ok'){
				$('#regconf-page').hide();
				$('#regdone-page').show();
			}else{
				push_msg('red', 'Указан не верный код');
			}
			$('.products-list').toggleClass('loader-blur');
		  }, "json");
		return false;
	});

	$('.order-block .amount-change input[type=number]').on('change', function(){
		if($(this).val() < 1){
			$(this).val(1);
		}else{
			$(this).val( Number($(this).val()).toFixed() );
		}
		$(this).closest('.price-block-col1').find('.cart-item_sum').html(number_format($(this).val()*$(this).closest('.cart-item').attr('data-price'), 2, '.', ' ')+' ₽');
		cart_add($(this).closest('.cart-item').attr('data-id'), $(this).val(), function(){});
		cart_refresh_price();
	});

	$("#btn--fastbuy").on('click', function(){
		window.location.href = '/order-confirm/?fast=1';
	});
	refresh_events();
});

function refresh_events(){
	$(".preview-btn").on('click', function(){
		//$(".product-preview-box").html('');
		$(".product-preview-loader").show();
		var product_box = $(this).closest('.product-box');
		$("#product-preview").attr('data-id', product_box.attr('data-id'));
		$('.preview-title').html(product_box.find('.product-name').text());
		$('.preview-sku span').html(product_box.find('.product-sku span').text());
		$('.preview-price').html(product_box.find('.product-price').text());
		$('.product-preview-head img').attr('src', product_box.find('.product-picture img').attr('src'));
		$('#product-preview .product-link').attr('href', product_box.find('.product-name').attr('href'));
		$("#product-preview").toggle();
		$(".product-preview-btns .cart").removeClass('filled');
		$.getJSON('/product-category?&product_info='+product_box.attr('data-id')+'&ajax=1', function( data ) {
			$('.product-preview-box').html(data.out);
			if(data.in_cart){
				$(".product-preview-btns .cart").addClass('filled');
			}else{
				$(".product-preview-btns .cart").removeClass('filled');
			}
			$(".product-preview-loader").hide();
		});
	});

	$(".product-preview-btns .cart").on('click', function(){
		cart_add($(this).closest('#product-preview').attr('data-id'), 1, function(){
			$("#cart-btn").addClass("filled");
			$(".product-preview-btns .cart").addClass("filled");
		});
	});
	$(".product-box .product-to-cart .quantity-cart").on('click', function(){
		$(this).addClass("filled");
		cart_add($(this).closest('.product-box').attr('data-id'), $(this).parent().find('input').val(), function(){});
	});

	$(".product-to-cart .quantity-cart.quantity-cart_label").on('click', function(){
		var btn = $(this);
		cart_add($(".product-to-cart .product-quantity input").attr('data-id'), $(".product-to-cart .product-quantity input").val(), function(){
			btn.addClass('filled');
		});
	});

	$("#filter-btn").on("click", openFilter);
	$("#filter-bg").on("click", closeFilter);
	$("#filter .filter-close-btn").on("click", closeFilter);
}

$("#cart-btn").on('click', function() {
	$("#cart-preview .cart-preview-products-container").html('');
	if(client_cart.length > 0){
		client_cart.forEach(function(cart){
			$("#cart-preview .cart-preview-products-container").append('<div class="cart-preview-products" data-id="'+cart.id+'"><a href="/product/'+cart.url+'" class="cart-preview-product"><img src="/images/uploads/miniature/'+cart.img+'" class="cart-preview-product-img"><div class="cart-preview-product-info"><p>'+cart.name+'</p><span>'+cart.price_text+'</span></div><div class="cart-preview-delete"><img src="/images/icons/close-colored.svg" class="svg"></div></a></div>');
		});
		$("#cart-preview .checkout-btn").show();
	}else{
		$("#cart-preview .cart-preview-products-container").append('<div class="cart-preview-products">Корзина пуста</div>');
		$("#cart-preview .checkout-btn").hide();
	}
	$(this).toggleClass("active");
	$("#cart-preview").slideToggle();
	$(".cart-preview-delete").on('click', function(){
		var del_cart_preview_products = $(this).closest('.cart-preview-products');
		cart_add(del_cart_preview_products.attr('data-id'), 0, function(){
			del_cart_preview_products.fadeOut(250, function(){ $(this).remove();});
			if(client_cart.length > 0){
				$("#cart-preview .checkout-btn").show();
			}else{
				$("#cart-preview .cart-preview-products-container").append('<div class="cart-preview-products">Корзина пуста</div>');
				$("#cart-preview .checkout-btn").hide();
			}
		});
		return false;
	});
	
	$("#cart-preview .cart-preview-products-container").toggleClass("scroll-active", !$("#cart-btn").hasClass("active"));
});

function filter_go(){
	$('.products-list').toggleClass('loader-blur');
	
	$('.filter.filter-slider').each(function(){
		var ftype = $(this).attr('data-type');
		filter_set(ftype+'_from', $(this).find('.range-from').val());
		filter_set(ftype+'_to', $(this).find('.range-to').val());
	});

	$(".filter-checkboxes").each(function(){
		var filter_name = 'filter_'+$(this).attr('data-name');
		var filter_vals = [];
		$(this).find('input[type=checkbox]:checked').each(function(){
			filter_vals.push($(this).val());
		});
		if(filter_vals.length > 0){
			filter_set(filter_name, filter_vals.join());
		}else{
			filter_unset(filter_name);
		}
	});

	
	var url = '';
	get_params.forEach((element) => {
		if(url == ''){url+='?'}else{url+='&'}
		url += element.name+'='+element.val;
	});
	url = window.location.pathname + url;
	//window.location.href = url;
	history.replaceState('data', '', url);	
	$.getJSON( url+'&ajax=1', function( data ) {
		$('.products-list').html(data.out);
		refresh_events();
		$('.filter-checkbox .checkbox-label span').html('(0)');
		$('.filter-checkbox .checkbox-label span').hide();
		$.each( data.attributes_inner_count, function( key, val ) {
			$('.filter-checkbox .checkbox-label span[data-id='+key+']').html('('+val+')');
			if(val > 0){
				$('.filter-checkbox .checkbox-label span[data-id='+key+']').show();
			}
		});

		
		
		loadAjaxListing = true;
		$('.products-list').toggleClass('loader-blur');
	});
}

function filter2_go(){
	$('#products-list').toggleClass('loader-blur');
	var i = 0;
	var s = '';
	$(".filter-checkboxes").each(function(){
		var filter_name = $(this).attr('data-name');
		var filter_vals = [];
		$(this).find('input[type=checkbox]:checked').each(function(){
			filter_vals.push($(this).val());
			s = $(this).val();
			i++;
		});
		if(filter_vals.length > 0){
			filter_set(filter_name, filter_vals.join());
		}else{
			filter_unset(filter_name);
		}
	});

	
	var url = '';
	if(i > 1){
		get_params.forEach((element) => {
			if(url == ''){url+='?'}else{url+='&'}
			url += element.name+'='+element.val;
		});
		url = '/collections/' + url;
		var pref = '&';
	}else{
		if(s == ''){
			url = '/collections/';
		}else{
			url = '/collections/' + s+'/';
		}
		var pref = '?';
	}
	history.replaceState('data', '', url);	
	
	$.getJSON( url+pref+'ajax=1', function( data ) {
		$('#products-list').html(data.out);
		refresh_events();
		loadAjaxListing = true;
		$('#products-list').toggleClass('loader-blur');
	});
}

function filter_set(filter_name, filter_val){
	var pushing = true;
	get_params.forEach((element) => {
		if(element.name == filter_name){
			element.val = filter_val;
			pushing = false;
		}
	});
	if(pushing)get_params.push({'name':filter_name,'val':filter_val});
}

function filter_unset(filter_name){
	var i = 0;
	get_params.forEach((element) => {
		if(element.name == filter_name){
			get_params.splice(i, 1);
		}
		i++;
	});
}

function initScrollingLoad() {
    //$loadManager = $(loaderManagerElementId); 
    $(window).scroll(function() {
		//console.log($(window).scrollTop() + $(window).height());
    	// Проверяем пользователя, находится ли он в нижней части страницы
    	if (loadAjaxListing && !loadAjax &&($(window).scrollTop() + $(window).height() > $(document).height() - 1500)) {
			loadAjax = true;
			
			var url = '';
			get_params.forEach((element) => {
				if(url == ''){url+='?'}else{url+='&'}
				url += element.name+'='+element.val;
			});
			url = window.location.pathname + url;
			//window.location.href = url;
			//$('.products-list').toggleClass('loader-blur');
			$.getJSON( url+'&ajax=1&position='+$(".product-card").length, function( data ) {
				if(data.out != ''){
					$('.products-list').append(data.out);
					refresh_events();
				}else{
					loadAjaxListing = false;
				}
				//$('.products-list').toggleClass('loader-blur');
				loadAjax = false;
			});
		}
   	});
}

function ajaxSearch(){
	$.getJSON( '/search/'+$('.nav-menu input[type=search]').val()+'/?ajax=2', function( data ) {
//		$('.products-list').html(data.out);
		$('.search_results').html(data.out);
        $('#nav .search_results').addClass('active');
		/*$('.filter-checkbox .checkbox-label span').html('(0)');
		$.each( data.attributes_inner_count, function( key, val ) {
			$('.filter-checkbox .checkbox-label span[data-id='+key+']').html('('+val+')');
		})
		loadAjaxListing = true;
		$('.products-list').toggleClass('loader-blur');*/
	});

	
}
function openFilter(){
	if(filterStatus) return;
	filterStatus = true;
	$("#catalog").addClass("filter-open");
	$("body").addClass("filter-open");
}

function closeFilter(){
	if(!filterStatus) return;
	filterStatus = false;
	$("#catalog").removeClass("filter-open");
	$("body").removeClass("filter-open");
}

function push_msg(color, msg, timing = 10000){
	$('.alerts').append('<div id="msg_'+msg_index+'" class="alert alert-'+color+' row"><div class="alert-message">'+msg+'</div> <img src="/images/icons/del-cross.svg"></div>');
	$('.alert img').click(function(){
		$(this).parent().fadeOut(250, function(){
			$(this).remove();
		});
	});
	var msg_current_id = msg_index;
	setTimeout(() => {
		$('#msg_'+msg_current_id).fadeOut(250, function(){
			$(this).remove();
		});
	}, timing);
	msg_index++;
}

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
  }

function cart_add(product_id, quantity, callback){
	$.post('/cart', { ajax: "cart_add", 'product_id': product_id,  'quantity':quantity}, function(data, textStatus) {
		client_cart = data.client_cart;
		//$(".nav-top_links #cart-btn .sum-text").html(data.client_cart_sum);
		$(".header_user-panel .cart-count").html(client_cart.length);
		/*if(client_cart.length > 0){
			$(".nav-top_links #cart-btn").addClass('filled');
		}else{
			$(".nav-top_links #cart-btn").removeClass('filled');
		}*/
		callback();
		if(quantity > 0){
			push_msg('green', 'Товары в корзине обновлены', 2000)
		}
	}, "json");
}

function cart_refresh_price(){
	var client_cart_price = 0;
	$('.order-block .cart-item').not('.cart-delivery').each(function(){
		client_cart_price = client_cart_price + ( Number($(this).attr('data-price') * $(this).find('.amount-change input[type=number]').val() ) );
	});
	$('.cart-total span').html( number_format(client_cart_price, 2, '.', ' '));
}

function number_format(number, decimals, dec_point, thousands_sep) {
	number = number.toFixed(decimals);

	var nstr = number.toString();
	nstr += '';
	x = nstr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? dec_point + x[1] : '';
	var rgx = /(\d+)(\d{3})/;

	while (rgx.test(x1))
		x1 = x1.replace(rgx, '$1' + thousands_sep + '$2');

	return x1 + x2;
}