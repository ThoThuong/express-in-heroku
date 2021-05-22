

(function ($) {
    "use strict";

    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    })

    /*==================================================================
    [ Validate ]*/

    alertify.set('notifier', 'position', 'top-right');
    var input = $('.validate-input .input100');
    $('.validate-form').on('submit', (e) => {
        // https://zinoui.com/blog/jquery-ajax-headers
        e.preventDefault();
        var check = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        if (check) {
            const data = {
                message: "cái này gửi từ browser bằng fetch api",
                email: $(input[0]).val(),
                password: $(input[1]).val(),
                remmeber: $('input:checkbox').is(":checked")
            };
            $.ajax({
                type: "POST",
                url: "/authen/api/login",
                data: JSON.stringify(data),
                // dataType: "application/json",
                contentType: 'application/json',
                statusCode: {
                    401: (responseObject, textStatus, jqXHR) => {
                        alertify.notify('Incorrect password', 'error', 5);
                    },
                    404: (responseObject, textStatus, jqXHR) => {
                        alertify.notify('Do not found user, Incorrect user or register new user', 'error', 5);
                    },
                    500: (responseObject, textStatus, errorThrown) => {
                        alertify.notify('undefined error, Reload page to solve', 'warning', 5);
                    },
                    // 200: (responseObject, textStatus, errorThrown) => {
                    //     setTimeout(() => {
                    //         alertify.notify('ok nha :v', 'success', 5);
                    //     }, 500);
                    // }
                },
            }).done((res) => {
                window.location = "/";
            }).fail((rese) => {
                console.log(rese);
            });
        }
    });

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }


})(jQuery);