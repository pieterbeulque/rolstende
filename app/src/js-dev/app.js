(function () {

    //if (!!('ontouchstart' in window)) {
    if (1 == 1) {
        $("#overlay").removeClass('hide');
        var app = new App();
        $(window).load(function() {
            setTimeout(function() {
                $("#overlay").fadeOut(400);
                $(".sidebar").css('opacity', '0');
                $(".boat-container").css({'opacity': '0', 'top': '50px'});
                $(".logo-front").css('opacity', '0');

                $("#app-wrapper").css({'opacity': '0'}).animate({
                    'opacity' : '1'
                }, 1500, function() {
                    $(".sidebar").css({'opacity': '1'});
                    $('body').css('background-image', 'none');
                });

                $(".logo-front").animate({
                    'opacity' : '1'
                }, 1500, function() {
                    $(".boat-container").animate({
                        'opacity': '1',
                        'top': '43px'
                    }, function () {
                        $('#overlay').remove();
                    });
                });
            }, 0);
        });
    } else {
        window.location = 'desktop.htm';
    }

})();