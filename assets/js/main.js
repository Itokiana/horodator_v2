
(function ($) {
    "use strict";

    setInterval(() => {
        if(sessionStorage.getItem("session") !== null){
            checkLog() 
        }
        // (async () => {
        //     console.log("WINDOW", await activeWin())
        // })();
    }, 3000);

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
                date2 = new Date();
                time = dateDiff(date1, date2)
                $("#timer").html(`${ ("0" + time.hour).slice(-2) }:${ ("0" + time.min).slice(-2) }:${ ("0" + time.sec).slice(-2) }`)
            }, 1000)
        }

        return check;
    });



    $(".when-paused").click((e) => {
        restartHorodator();
        timerID = setInterval(() => {
            date2 = new Date();
            time = dateDiff(date1, date2)
            $("#timer").html(`${ ("0" + time.hour).slice(-2) }:${ ("0" + time.min).slice(-2) }:${ ("0" + time.sec).slice(-2) }`)
        }, 1000)
        sessionStorage.removeItem("state")
        $(".when-paused").hide();
        $(".when-unpaused").show();
    })
    $(".when-unpaused").click((e) => {
        stopHorodator();
        clearInterval(timerID);
        sessionStorage.setItem("state", "pause")
        $(".when-paused").show();
        $(".when-unpaused").hide();
    })
    $("#logout").click((e) => {
        logout();
        clearInterval(timerID)
        clearInterval(inactivitySenderID)
        sessionStorage.removeItem("state")
        location.reload(true)
    });

    axios.get(api_base_uri.horodator_server + '/dashboard/settings/time_check')
    .then((res) => {
        clearInterval(inactivitySenderID)
      inactivitySenderID = setInterval(() => {
        let inactivity_position = JSON.parse(localStorage.getItem("inactivity_position"));
        const schedule = JSON.parse(sessionStorage.getItem('owner'))
  
        if(inactivity_position !== null && inactivity_position.length !== 0 && schedule !== null){
          reportInactivity({ schedule: schedule.schedule, inactivity: inactivity_position[0] })
        }
      }, parseInt(res.data.inactivity))
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