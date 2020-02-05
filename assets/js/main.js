
(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('[data-toggle="tooltip"]').tooltip()

    $('.validate-form').on('submit',function(e){
        e.preventDefault()
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check){
            clearInterval(timerID)
            login($(input[0]).val(), $(input[1]).val());
            timerID = setInterval(() => {
                time = dateDiff(date1, new Date())
                $("#timer").html(`${ ("0" + time.hour).slice(-2) }:${ ("0" + time.min).slice(-2) }:${ ("0" + time.sec).slice(-2) }`)
            }, 1000)

            setTimeout(() => {
                clearInterval(timerID)
            }, 20000);

        }

        return check;
    });

    $(".when-paused").click((e) => {
        startHorodator();
    })
    $(".when-unpaused").click((e) => {
        stopHorodator();
        clearInterval(timerID)
    })

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
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