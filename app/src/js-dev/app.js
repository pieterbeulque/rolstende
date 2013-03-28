(function () {

    var sv,
        location,
        server = "http://192.168.2.9/Devine/_MAMP_JAAR2/_SEM2/MAIV/rolstende/";

    sv = new SlidingView( 'sidebar', 'app' );
    sv.sidebarWidth = 90;

    sv.sidebar.oriDomi({ hPanels: 1, vPanels: 2, speed:1, perspective:1000, shadingIntensity:2 });
    sv.sidebar.oriDomi( 'accordion', 45 );

    sv.sidebar.bind( "slidingViewProgress", function(event, data) {

        var fudge = 1
        var half = data.max/2;
        if ( data.current < half ) {
            fudge = (data.current)/half
        } else if ( data.current > half ) {
            fudge = (half-(data.current-half))/half
        }
        fudge *= 15

        var angle = 90-((90*(data.current/data.max)));

        if ( (angle+fudge) > 0 ) {
            sv.sidebar.oriDomi( 'restoreOriDomi' );
            sv.sidebar.oriDomi( 'accordion', (angle+fudge) );
        }
        else {
            sv.sidebar.oriDomi( 'restoreDOM' );
        }   

    });

    // var map = new RolstendeMap($('#map_canvas'));

    var calendar = new Calendar($('#calendar'));

    $('#calendar-prev').on('click', function () {
        calendar.previousMonth();
        return false;
    });

    $('#calendar-next').on('click', function () {
        calendar.nextMonth();
        return false;
    });

    $("#body").click(function() {
        sv.close();
    });

    $(".switch").click(function() {
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
    })

    $('#app-wrapper').on('click', '#sidebar a', function (e) {
        alert('hoi');
    });

    $(window).load(function() {
        setTimeout(function() {
            $("#overlay").fadeOut(400);
            $(".sidebar").css('opacity', '0');
            $(".boat-container").css({'opacity': '0', 'top': '50px'});
            $(".logo-front").css('opacity', '0');

            $("#app-wrapper").css({'opacity': '0'}).animate({
                'opacity' : '1',
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
                });
            });
        }, 0);
    });

})();