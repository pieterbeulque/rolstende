(function () {

"use strict";

(function () {

    var sv;

    sv = new SlidingView( 'sidebar', 'app' );
    sv.sidebarWidth = 90;
    $("#sidebar, #app").css({'height': '100%'});
    sv.sidebar.oriDomi({ hPanels: 1, vPanels: 2, speed:1, perspective:1000, shadingIntensity:3 });
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

    $("#body").click(function() {
        sv.close();
    });

})();

})();