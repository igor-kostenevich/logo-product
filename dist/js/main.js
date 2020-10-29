var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

//FORMS
function forms() {
	//SELECT
	if ($('select').length > 0) {
		function selectscrolloptions() {
			var scs = 100;
			var mss = 50;
			if (isMobile.any()) {
				scs = 10;
				mss = 1;
			}

			var opt = {
				cursorcolor: "#2078e5",
				cursorwidth: "3px",
				background: "",
				autohidemode: false,
				bouncescroll: false,
				cursorborderradius: "0px",
				scrollspeed: scs,
				mousescrollstep: mss,
				directionlockdeadzone: 0,
				cursorborder: "0px solid #fff",
			};
			return opt;
		}

		function select() {
			$.each($('select'), function (index, val) {
				var ind = index;
				$(this).hide();
				if ($(this).parent('.select-block').length == 0) {
					$(this).wrap("<div class='select-block " + $(this).attr('class') + "-select-block'></div>");
				} else {
					$(this).parent('.select-block').find('.select').remove();
				}
				var milti = '';
				var check = '';
				var sblock = $(this).parent('.select-block');
				var soptions = "<div class='select-options'><div class='select-options-scroll'><div class='select-options-list'>";
				if ($(this).attr('multiple') == 'multiple') {
					milti = 'multiple';
					check = 'check';
				}
				$.each($(this).find('option'), function (index, val) {
					if ($(this).attr('value') != '') {
						soptions = soptions + "<div data-value='" + $(this).attr('value') + "' class='select-options__value_" + ind + " select-options__value value_" + $(this).val() + " " + $(this).attr('class') + " " + check + "'>" + $(this).html() + "</div>";
					} else if ($(this).parent().attr('data-label') == 'on') {
						if (sblock.find('.select__label').length == 0) {
							sblock.prepend('<div class="select__label">' + $(this).html() + '</div>');
						}
					}
				});
				soptions = soptions + "</div></div></div>";
				if ($(this).attr('data-type') == 'search') {
					sblock.append("<div data-type='search' class='select_" + ind + " select" + " " + $(this).attr('class') + "__select " + milti + "'>" +
						"<div class='select-title'>" +
						"<div class='select-title__arrow ion-ios-arrow-down'></div>" +
						"<input data-value='" + $(this).find('option[selected="selected"]').html() + "' class='select-title__value value_" + $(this).find('option[selected="selected"]').val() + "' />" +
						"</div>" +
						soptions +
						"</div>");
					$('.select_' + ind).find('input.select-title__value').jcOnPageFilter({
						parentSectionClass: 'select-options_' + ind,
						parentLookupClass: 'select-options__value_' + ind,
						childBlockClass: 'select-options__value_' + ind
					});
				} else {
					sblock.append("<div class='select_" + ind + " select" + " " + $(this).attr('class') + "__select " + milti + "'>" +
						"<div class='select-title'>" +
						"<div class='select-title__arrow ion-ios-arrow-down'></div>" +
						"<div class='select-title__value value_" + $(this).find('option[selected="selected"]').val() + "'>" + $(this).find('option[selected="selected"]').html() + "</div>" +
						"</div>" +
						soptions +
						"</div>");
				}
				if ($(this).find('option[selected="selected"]').val() != '') {
					sblock.find('.select').addClass('focus');
				}
				if ($(this).attr('data-req') == 'on') {
					$(this).addClass('req');
				}
				$(".select_" + ind + " .select-options-scroll").niceScroll('.select-options-list', selectscrolloptions());
			});
		}
		select();

		$('body').on('keyup', 'input.select-title__value', function () {
			$('.select').not($(this).parents('.select')).removeClass('active').find('.select-options').slideUp(50);
			$(this).parents('.select').addClass('active');
			$(this).parents('.select').find('.select-options').slideDown(50, function () {
				$(this).find(".select-options-scroll").getNiceScroll().resize();
			});
			$(this).parents('.select-block').find('select').val('');
		});
		$('body').on('click', '.select', function () {
			if (!$(this).hasClass('disabled')) {
				$('.select').not(this).removeClass('active').find('.select-options').slideUp(50);
				$(this).toggleClass('active');
				$(this).find('.select-options').slideToggle(50, function () {
					$(this).find(".select-options-scroll").getNiceScroll().resize();
				});

				//	var input=$(this).parent().find('select');
				//removeError(input);

				if ($(this).attr('data-type') == 'search') {
					if (!$(this).hasClass('active')) {
						searchselectreset();
					}
					$(this).find('.select-options__value').show();
				}
			}
		});
		$('body').on('click', '.select-options__value', function () {
			if ($(this).parents('.select').hasClass('multiple')) {
				if ($(this).hasClass('active')) {
					if ($(this).parents('.select').find('.select-title__value span').length > 0) {
						$(this).parents('.select').find('.select-title__value').append('<span data-value="' + $(this).data('value') + '">, ' + $(this).html() + '</span>');
					} else {
						$(this).parents('.select').find('.select-title__value').data('label', $(this).parents('.select').find('.select-title__value').html());
						$(this).parents('.select').find('.select-title__value').html('<span data-value="' + $(this).data('value') + '">' + $(this).html() + '</span>');
					}
					$(this).parents('.select-block').find('select').find('option').eq($(this).index() + 1).prop('selected', true);
					$(this).parents('.select').addClass('focus');
				} else {
					$(this).parents('.select').find('.select-title__value').find('span[data-value="' + $(this).data('value') + '"]').remove();
					if ($(this).parents('.select').find('.select-title__value span').length == 0) {
						$(this).parents('.select').find('.select-title__value').html($(this).parents('.select').find('.select-title__value').data('label'));
						$(this).parents('.select').removeClass('focus');
					}
					$(this).parents('.select-block').find('select').find('option').eq($(this).index() + 1).prop('selected', false);
				}
				return false;
			}

			if ($(this).parents('.select').attr('data-type') == 'search') {
				$(this).parents('.select').find('.select-title__value').val($(this).html());
				$(this).parents('.select').find('.select-title__value').attr('data-value', $(this).html());
			} else {
				$(this).parents('.select').find('.select-title__value').attr('class', 'select-title__value value_' + $(this).data('value'));
				$(this).parents('.select').find('.select-title__value').html($(this).html());

			}

			$(this).parents('.select-block').find('select').find('option').removeAttr("selected");
			if ($.trim($(this).data('value')) != '') {
				$(this).parents('.select-block').find('select').val($(this).data('value'));
				$(this).parents('.select-block').find('select').find('option[value="' + $(this).data('value') + '"]').attr('selected', 'selected');
			} else {
				$(this).parents('.select-block').find('select').val($(this).html());
				$(this).parents('.select-block').find('select').find('option[value="' + $(this).html() + '"]').attr('selected', 'selected');
			}


			if ($(this).parents('.select-block').find('select').val() != '') {
				$(this).parents('.select-block').find('.select').addClass('focus');
			} else {
				$(this).parents('.select-block').find('.select').removeClass('focus');

				$(this).parents('.select-block').find('.select').removeClass('err');
				$(this).parents('.select-block').parent().removeClass('err');
				$(this).parents('.select-block').removeClass('err').find('.form__error').remove();
			}
			if (!$(this).parents('.select').data('tags') != "") {
				if ($(this).parents('.form-tags').find('.form-tags__item[data-value="' + $(this).data('value') + '"]').length == 0) {
					$(this).parents('.form-tags').find('.form-tags-items').append('<a data-value="' + $(this).data('value') + '" href="" class="form-tags__item">' + $(this).html() + '<span class="fa fa-times"></span></a>');
				}
			}
			$(this).parents('.select-block').find('select').change();

			if ($(this).parents('.select-block').find('select').data('update') == 'on') {
				select();
			}
		});
		$(document).on('click touchstart', function (e) {
			if (!$(e.target).is(".select *") && !$(e.target).is(".select")) {
				$('.select').removeClass('active');
				$('.select-options').slideUp(50, function () {});
				searchselectreset();
			};
		});
		$(document).on('keydown', function (e) {
			if (e.which == 27) {
				$('.select').removeClass('active');
				$('.select-options').slideUp(50, function () {});
				searchselectreset();
			}
		});
	}

	$.each($('input.phone'), function (index, val) {
		$(this).attr('type', 'tel');
		$(this).focus(function () {
			$(this).inputmask('+8 (999) 999-99-99', {
				clearIncomplete: true,
				clearMaskOnLostFocus: true,
				"onincomplete": function () {
					maskclear($(this));
				}
			});
			$(this).addClass('focus');
			$(this).parent().addClass('focus');
			$(this).parent().removeClass('err');
			$(this).removeClass('err');
		});
	});
	$('input.phone').focusout(function (event) {
		maskclear($(this));
	});

	//OPTION
	$.each($('.option.active'), function (index, val) {
		$(this).find('input').prop('checked', true);
	});
	$('.option').click(function (event) {
		if (!$(this).hasClass('disable')) {
			if ($(this).hasClass('active') && $(this).hasClass('order')) {
				$(this).toggleClass('orderactive');
			}
			$(this).parents('.options').find('.option').removeClass('active');
			$(this).toggleClass('active');
			$(this).children('input').prop('checked', true);
		}
	});

	//QUANTITY
	$('.quantity__btn').click(function (event) {
		var n = parseInt($(this).parent().find('.quantity__input').val());
		if ($(this).hasClass('dwn')) {
			n = n - 1;
			if (n < 1 || n == undefined || n == null || isNaN(n)) {
				n = 1;
			}
		} else {
			n = n + 1;
			if (n == undefined || n == null || isNaN(n)) {
				n = 1;
			}
		}

		$(this).parent().find('.quantity__input').val(n);
		return false;
	});

	$('.quantity__input').blur(function () {
		if ($('.quantity__input').val().length == 0) {
			$('.quantity__input').val(1);
		}
	});
	
	// =======================================================

	$('.numeric').on("change keyup input click", function () {
		if (this.value.match(/[^0-9]/g)) {
			this.value = this.value.replace(/[^0-9]/g, "");
		};
	});

	$('.literal').on("change keyup input click", function () {
		if (this.value.match(/[^a-zA-Zа-яА-я]/g)) {
			this.value = this.value.replace(/[^a-zA-Zа-яА-я]/g, "");
		};
	});

	$('.filter').keypress(function (e) {
		if (e.which == 13 || e.keyCode == 13) {
			e.preventDefault();
		}
	});

	//RANGE
	if ($("#range").length > 0) {
		$("#range").slider({
			range: true,
			min: 0,
			max: 200000,
			values: [0, 200000],
			slide: function (event, ui) {
				var minRangeValue = ui.values[0].toLocaleString('us-Us');
				var maxRangeValue = ui.values[1].toLocaleString('us-Us');

				$('#rangefrom').val(minRangeValue);
				$('#rangeto').val(maxRangeValue);

				$(this).find('.ui-slider-handle').eq(0).html('<span>' + minRangeValue + '</span>');
				$(this).find('.ui-slider-handle').eq(1).html('<span>' + maxRangeValue + '</span>');

			},
			change: function (event, ui) {
				if (ui.values[0] != $("#range").slider("option", "min") || ui.values[1] != $("#range").slider("option", "max")) {
					$('#range').addClass('act');
				} else {
					$('#range').removeClass('act');
				}
			}
		});

		$('#rangefrom').val($("#range").slider("values", 0));
		$('#rangeto').val($("#range").slider("values", 1));

		$("#range").find('.ui-slider-handle').eq(0).html('<span>' + $("#range").slider("option", "min") + '</span>');
		$("#range").find('.ui-slider-handle').eq(1).html('<span>' + $("#range").slider("option", "max") + '</span>');

		$("#range").find('.ui-slider-handle').eq(0).addClass('left');
		$("#range").find('.ui-slider-handle').eq(1).addClass('right');


		$("#rangefrom").on({
			change: function(){
				if ($(this).val().length == 0) { // 0<
					$(this).val($("#range").slider("option", "min"));
				}
				if ($(this).val() > $("#range").slider("values", 1)) { // min value > max value
					$(this).val($("#range").slider("values", 1));
				}
				$("#range").slider("values", 0, $(this).val());
				$("#range > .left span").html($(this).val());
			},
			focus: function () {
				this.value = '';
			},
			blur: function () {
				if (this.value == '') {
					this.value = $("#range").slider("values", 0);
				}
				this.value = this.value.replace(/[^\d]/g, '').replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
				$("#range > .left span").html(this.value);
			},
			keypress: function(e){
				if (e.which == 13 || e.keyCode == 13) {
					$("#rangefrom").blur();
				}
			}
		});

		$("#rangeto").on({
			change: function(){
				if ($(this).val() * 1 > $("#range").slider("option", "max") * 1) {
					$(this).val($("#range").slider("option", "max"));
				}
				if ($(this).val() * 1 < $("#range").slider("option", "min") * 1) {
					$(this).val($("#range").slider("option", "min"));
				}
				if ($(this).val().length == 0) {
					$(this).val($("#range").slider("option", "max"));
				}
				if ($(this).val() < $("#range").slider("values", 0)) {
					$(this).val($("#range").slider("values", 0));
				}
				$("#range").slider("values", 1, $(this).val());
				$("#range > .right span").html($(this).val());
			},
			focus: function () {
				this.value = '';
			},
			blur: function () {
				if (this.value == '') {
					this.value = $("#range").slider("values", 1);
				}
				this.value = this.value.replace(/[^\d]/g, '').replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
				$("#range > .right span").html(this.value);
			},
			keypress: function(e){
				if (e.which == 13 || e.keyCode == 13) {
					$("#rangeto").blur();
				}
			}
		});

		$(window).on('load', function () {
			$("#rangeto").triggerHandler("blur");
		});
	}
}
forms();


function digi(str) {
	var r = str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	return r;
}

//VALIDATE FORMS
$('form button[type=submit]').click(function () {
	var er = 0;
	var form = $(this).parents('form');
	var ms = form.data('ms');
	$.each(form.find('.req'), function (index, val) {
		er += formValidate($(this));
	});
	if (er == 0) {
		removeFormError(form);
		if (ms != null && ms != '') {
			showMessageByClass(ms);
			return false;
		}
	} else {
		return false;
	}
});

function formValidate(input) {
	var er = 0;
	var form = input.parents('form');
	if (input.attr('name') == 'email' || input.hasClass('email')) {
		if (input.val() != input.attr('data-value')) {
			var em = input.val().replace(" ", "");
			input.val(em);
		}
		if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(input.val())) || input.val() == input.attr('data-value')) {
			er++;
			addError(input);
		} else {
			removeError(input);
		}
	} else {
		if (input.val() == '' || input.val() == input.attr('data-value')) {
			er++;
			addError(input);
		} else {
			removeError(input);
		}
	}

	if (input.hasClass('name')) {
		if (!(/^[А-Яа-яa-zA-Z-]+( [А-Яа-яa-zA-Z-]+)$/.test(input.val()))) {
			er++;
			addError(input);
		}
	}
	return er;
}


function clearForm(form) {
	$.each(form.find('.input'), function (index, val) {
		$(this).removeClass('focus').val($(this).data('value'));
		$(this).parent().removeClass('focus');
		if ($(this).hasClass('phone')) {
			maskclear($(this));
		}
	});
}

function addError(input) {
	input.addClass('err');
	input.parent().addClass('err');
	input.parent().find('.form__error').remove();
	if (input.hasClass('email')) {
		var error = '';
		if (input.val() == '' || input.val() == input.attr('data-value')) {
			error = input.data('error');
		} else {
			error = input.data('error');
		}
		if (error != null) {
			input.parent().append('<div class="form__error">' + error + '</div>');
		}
	} else {
		if (input.data('error') != null && input.parent().find('.form__error').length == 0) {
			input.parent().append('<div class="form__error">' + input.data('error') + '</div>');
		}
	}
	if (input.parents('.select-block').length > 0) {
		input.parents('.select-block').parent().addClass('err');
		input.parents('.select-block').find('.select').addClass('err');
	}
}

function removeError(input) {
	input.removeClass('err');
	input.parent().removeClass('err');
	input.parent().find('.form__error').remove();

	if (input.parents('.select-block').length > 0) {
		input.parents('.select-block').parent().removeClass('err');
		input.parents('.select-block').find('.select').removeClass('err').removeClass('active');
		//input.parents('.select-block').find('.select-options').hide();
	}
}

function removeFormErrors(form) {
	form.find('.err').removeClass('err');
	form.find('.form__error').remove();
}

function maskclear(n) {
	if (n.val() == "") {
		n.inputmask('remove');
		n.val(n.attr('data-value'));
		n.removeClass('focus');
		n.parent().removeClass('focus');
	}
}

function searchselectreset() {
	$.each($('.select[data-type="search"]'), function (index, val) {
		var block = $(this).parent();
		var select = $(this).parent().find('select');
		if ($(this).find('.select-options__value:visible').length == 1) {
			$(this).addClass('focus');
			$(this).parents('.select-block').find('select').val($('.select-options__value:visible').data('value'));
			$(this).find('.select-title__value').val($('.select-options__value:visible').html());
			$(this).find('.select-title__value').attr('data-value', $('.select-options__value:visible').html());
		} else if (select.val() == '') {
			$(this).removeClass('focus');
			block.find('input.select-title__value').val(select.find('option[selected="selected"]').html());
			block.find('input.select-title__value').attr('data-value', select.find('option[selected="selected"]').html());
		}
	});
}

var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};


function isIE() {
	ua = navigator.userAgent;
	var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}

if (isIE()) {
	document.querySelector('body').classList.add('ie');
}

function ibg() {
	if (isIE()) {
		var ibg = document.querySelectorAll(".ibg");

		for (var i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}
	}
}
ibg();

if (location.hash) {
	var hsh = location.hash.replace('#', '');
	if ($('.popup-' + hsh).length > 0) {
		popupOpen(hsh);
	} else if ($('div.' + hsh).length > 0) {
		$('body,html').animate({
			scrollTop: $('div.' + hsh).offset().top,
		}, 500, function () {});
	}
}
$('.wrapper').addClass('loaded');

var act = "click";
if (isMobile.iOS()) {
	var act = "touchstart";
}

//================= MENU

var iconMenu = document.querySelector(".icon-menu");

if (iconMenu != null) {
	var delay = 500;
	var body = document.querySelector("body");
	var menuBody = document.querySelector(".menu__body");
	iconMenu.addEventListener("click", function (e) {
		if (!body.classList.contains('wait')) {
			body_lock(delay);
			iconMenu.classList.toggle("active");
			// menuBody.classList.toggle("disable")
			menuBody.classList.toggle("active");
		}
	});
}

;

function menu_close() {
	var iconMenu = document.querySelector(".icon-menu");
	var menuBody = document.querySelector(".menu__body");
	iconMenu.classList.remove("active");
	menuBody.classList.remove("active");
} //=================
//BodyLock


function body_lock(delay) {
	var body = document.querySelector("body");

	if (body.classList.contains('lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}

function body_lock_remove(delay) {
	var body = document.querySelector("body");

	if (!body.classList.contains('wait')) {
		var lock_padding = document.querySelectorAll(".lp");
		setTimeout(function () {
			for (var index = 0; index < lock_padding.length; index++) {
				var el = lock_padding[index];
				el.style.paddingRight = '0px';
			}

			body.style.paddingRight = '0px';
			body.classList.remove("lock");
		}, delay);
		body.classList.add("wait");
		setTimeout(function () {
			body.classList.remove("wait");
		}, delay);
	}
}

function body_lock_add(delay) {
	var body = document.querySelector("body");

	if (!body.classList.contains('wait')) {
		var lock_padding = document.querySelectorAll(".lp");

		for (var index = 0; index < lock_padding.length; index++) {
			var el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}

		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		body.classList.add("lock");
		body.classList.add("wait");
		setTimeout(function () {
			body.classList.remove("wait");
		}, delay);
	}
} //=================

//Клик вне области
$(document).on('click touchstart', function (e) {
	if (!$(e.target).is(".select *")) {
		$('.select').removeClass('active');
	};
});


//UP
$(window).scroll(function () {
	var w = $(window).width();
	if ($(window).scrollTop() > 50) {
		$('#up').fadeIn(300);
	} else {
		$('#up').fadeOut(300);
	}
});
$('#up').click(function (event) {
	$('body,html').animate({
		scrollTop: 0
	}, 300);
});



//TABS
$('body').on('click', '.tab__navitem', function (event) {
	var eq = $(this).index();
	if ($(this).hasClass('parent')) {
		var eq = $(this).parent().index();
	}
	if (!$(this).hasClass('active')) {
		$(this).closest('.tabs').find('.tab__navitem').removeClass('active');
		$(this).addClass('active');
		$(this).closest('.tabs').find('.tab__item').removeClass('active').eq(eq).addClass('active');
		if ($(this).closest('.tabs').find('.slick-slider').length > 0) {
			$(this).closest('.tabs').find('.slick-slider').slick('setPosition');
		}
	}
});
$.each($('.spoller.active'), function (index, val) {
	$(this).next().show();
});
$('body').on('click', '.spoller', function (event) {
	if ($(this).hasClass('mob') && !isMobile.any()) {
		return false;
	}

	if ($(this).parents('.one').length > 0) {
		$(this).parents('.one').find('.spoller').not($(this)).removeClass('active').next().slideUp(300);
		$(this).parents('.one').find('.spoller').not($(this)).parent().removeClass('active');
	}

	if ($(this).hasClass('closeall') && !$(this).hasClass('active')) {
		$.each($(this).closest('.spollers').find('.spoller'), function (index, val) {
			$(this).removeClass('active');
			$(this).next().slideUp(300);
		});
	}
	if ($(this).not('.active')) {
		$(this).toggleClass('active').next().slideToggle(300, function (index, val) {
			if ($(this).parent().find('.slick-slider').length > 0) {
				$(this).parent().find('.slick-slider').slick('setPosition');
			}
		});
	} else {

	}
	return false;
});


function scrolloptions() {
	var scs = 100;
	var mss = 50;
	var bns = false;
	if (isMobile.any()) {
		scs = 10;
		mss = 1;
		bns = true;
	}
	var opt = {
		cursorcolor: "#fff",
		cursorwidth: "4px",
		background: "",
		autohidemode: true,
		cursoropacitymax: 0.4,
		bouncescroll: bns,
		cursorborderradius: "0px",
		scrollspeed: scs,
		mousescrollstep: mss,
		directionlockdeadzone: 0,
		cursorborder: "0px solid #fff",
	};
	return opt;
}

function scroll() {
	$('.scroll-body').niceScroll('.scroll-list', scrolloptions());
}
if (navigator.appVersion.indexOf("Mac") != -1) {} else {
	if ($('.scroll-body').length > 0) {
		scroll();
	}
}




function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support == true) {
		document.querySelector('body').classList.add('_webp');
	} else {
		document.querySelector('body').classList.add('_no-webp');
	}
});


if (isMobile.any()) {
	let menuShow = document.querySelectorAll('.page-menu__parent > a');
	for (let i = 0; i < menuShow.length; i++) {
		let menuShowActive = menuShow[i];
		menuShowActive.addEventListener("click", function (e) {
			menuShowActive.parentElement.classList.toggle('active');
			e.preventDefault();

		});
	}
} else {
	let menuShow = document.querySelectorAll('.page-menu__parent');

	for (let i = 0; i < menuShow.length; i++) {
		let menuShowActive = menuShow[i];
		menuShowActive.addEventListener('mouseenter', function (e) {
			menuShowActive.classList.add('active');
		});
		menuShowActive.addEventListener('mouseleave', function (e) {
			menuShowActive.classList.remove('active');
		});
	}
}


let menuPageBurger = document.querySelector('.page-menu__burger');
let searchSelect = document.querySelector('.search-page__title');

if (document.querySelector('.page-menu')) {
	menuPageBurger.addEventListener("click", function (e) {
		menuPageBurger.classList.toggle('active');
	});
}
 
$('.page-menu__body').hide();

$('.page-menu__burger').click(function () {
	$('.page-menu__body').slideToggle();
});

$('.search-page__title').click(function () {
	$(searchSelect).toggleClass('active');
	$('.categories-search').slideToggle(500);
});


let checkboxCategories = document.querySelectorAll('.categories-search__checkbox');
for (let i = 0; i < checkboxCategories.length; i++) {
	const checkboxCategory = checkboxCategories[i];

	checkboxCategory.addEventListener('change', function (e) {
		checkboxCategory.classList.toggle('active');

		let checkboxActiveCategories = document.querySelectorAll(".categories-search__checkbox.active");

		if (checkboxActiveCategories.length > 0) {
			searchSelect.classList.add('categories');
			let searchQuantity = document.querySelector('.search-page__quantity');
			searchQuantity.innerHTML = searchQuantity.getAttribute('data-text') + ' ' + checkboxActiveCategories.length;
		} else {
			searchSelect.classList.add('categories');
		}
	});
}


if (isMobile.any()) {
	$('.filter__title').click(function (e) {
		$('.filter__content').slideToggle(500);
	});
}

$('.view-catalog__item').click(function(){
	console.log($(this));
	$('.view-catalog__item').removeClass('active');
	$(this).addClass('active');
})

//Adaptive functions

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = "max"; //Для MobileFirst поменять на min

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			} //Для MobileFirst поменять
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());


//=================================================
// MENU

// let iconMenu = document.querySelector(".icon-menu");
// if(iconMenu != null){
// 	let delay = 500;
// 	let body = document.querySelector("body");
// 	let menuBody = document.querySelector('.menu__body');
// 	iconMenu.addEventListener("click", e => {
// 		if (!body.classList.contains('wait')) {
// 			// body_lock(delay);
// 			iconMenu.classList.toogle("active");
// 			menuBody.classList.toogle("active");
// 		}
// 	});
// }

// function menu_close() {
// 	let iconMenu = document.querySelector(".icon-menu");
// 	let menuBody = document.querySelector('.menu__body');
// 	iconMenu.classList.remove("active");
// 	menuBody.classList.remove("active");
// }


// $(window).resize(function(event) {
// 	adaptive_function();
// });
// function adaptive_header(w,h) {
// 		var headerMenu=$('.header-menu-mobile');
// 		var headerLang=$('.header-top-lang');
// 	if(w<=768){
// 		if(!headerLang.hasClass('done')){
// 			headerLang.addClass('done').appendTo(headerMenu);
// 		}
// 	}else{
// 		if(headerLang.hasClass('done')){
// 			headerLang.removeClass('done').prependTo($('.header-top'));
// 		}
// 	}

// 	if(w<=768){
// 		if(!$('.header-bottom-menu').hasClass('done')){
// 			$('.header-bottom-menu').addClass('done').appendTo(headerMenu);
// 		}
// 	}else{
// 			$.each($('.header-bottom-menu'), function(){
// 				if($(this).hasClass('header-bottom-menu--right')){
// 					if($(this).hasClass('done')){
// 						$(this).removeClass('done').prependTo($('.header-bottom__column').eq(2));
// 					}
// 				}else{
// 						if($(this).hasClass('done')){
// 							$(this).removeClass('done').prependTo($('.header-bottom__column').eq(0));
// 						}
// 					}
// 			});
// 		}
// }

// function adaptive_function() {
// 		var w=$(window).outerWidth();
// 		var h=$(window).outerHeight();
// 	adaptive_header(w,h);
// }
// 	adaptive_function();


if (document.querySelector('.mainslider')) {
	$('.mainslider__body').slick({
		lazyLoad: 'ondemand',
		dots: true,
		arrows: false,
		infinite: true,
		speed: 600,
		slidesToShow: 1,
		slidesToScroll: 1,
		dotsClass: 'mainslider__dotts',
		adaptiveHeight: true
	});

	document.addEventListener('DOMContentLoaded', function () {
		let mainsliderImages = document.querySelectorAll('.mainslider__image');
		let mainsliderImageArr = Array.prototype.slice.call(mainsliderImages);
		let mainsliderDotts = document.querySelectorAll('.mainslider__dotts li button');
		mainsliderImageArr = mainsliderImageArr.slice(1);

		for (let index = 0; index < mainsliderImageArr.length; index++) {
			const mainsliderImage = mainsliderImageArr[index].querySelector('img').getAttribute('src');
			if (mainsliderDotts[index] !== undefined) {
				mainsliderDotts[index].style.backgroundImage = "url('" + mainsliderImage + "')";
			}
		}
	});
}

// Products slider

if (document.querySelector('.products-slider')) {

	$('.products-slider__item').on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
		var i = (currentSlide ? currentSlide : 0) + 1;
		$('.products-slider__info-pagination').html('<span class="slick-pagination-current">' + i + '</span>' + ' / ' + '<span class="slick-pagination-total">' + slick.slideCount + '</span>');
	});

	$('.products-slider__item').slick({
		lazyLoad: 'ondemand',
		dots: false,
		arrows: true,
		infinite: true,
		speed: 600,
		slidesToShow: 1,
		slidesToScroll: 1,
		adaptiveHeight: true,
		prevArrow: '.products-slider__arrow_prev',
		nextArrow: '.products-slider__arrow_next'
	});
}

// Brands slider 

if (document.querySelector('.brands-slider')) {
	$('.brands-slider__body').slick({
		lazyLoad: 'ondemand',
		dots: false,
		arrows: true,
		infinite: true,
		speed: 600,
		slidesToShow: 5,
		slidesToScroll: 1,
		prevArrow: '.brands-slider__arrow_prev',
		nextArrow: '.brands-slider__arrow_next',
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});
}


if($('.images-product')){
	$('.images-product__mainslider').slick({
		lazyLoad: 'ondemand',
		dots: false,
		arrows: false,
		infinite: true,
		// draggable: false,
		// swipe: false,
		speed: 600,
		slidesToShow: 1,
		slidesToScroll: 1,
		asNavFor: '.images-product__subslider'
	});

	
}
$('.images-product__subslider').slick({
	lazyLoad: 'ondemand',
	dots: false,
	arrows: false,
	speed: 600,
	infinite: true,
	slidesToShow: 4,
	slidesToScroll: 1,
	asNavFor: '.images-product__mainslider',
	focusOnSelect: true
});
