

$(function () {
	'use strict';
	$('.form-control').on('input', function () {
		var $field = $(this).closest('.form-group');
		if (this.value) {
			$field.addClass('field--not-empty');
		} else {
			$field.removeClass('field--not-empty');
		}
	});

	$(document).on('submit', "#form-register", async (e) => {
		e.preventDefault();
		alertify.set('notifier', 'position', 'top-right');
		const username = $('#name').val();
		const email = $('#email').val();
		const password = $('#password').val();
		const rePassword = $('#re-password').val();
		const term = $('input:checkbox').is(":checked");

		let data = {
			'username': username,
			'email': email,
			'password': password,
			'rePassword': rePassword,
			'term': term,
		};
		let dataJson = JSON.stringify(data);

		$.ajax({
			type: "POST",
			url: "/authen/api/register",
			data: dataJson,
			dataType: "json",
			contentType: "application/json",
			statusCode: {
				400: (responseObject, textStatus, jqXHR) => {
					console.log(responseObject);
					alertify.notify('email đã tồn tại', 'error', 5);
				},
			}
		}).done(data => {
			alertify.notify('đi đăng nhập đi', 'error', 5);
			window.location = '/authen/login';
		}).fail((err) => {
			console.log(err);
			alertify.notify(`thông tin đăng kí không hợp lệ`, 'error', 5);
		});
	});
});