(function () {

"use strict";

(function () {

    var sv;

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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(maps, error);
    } else {
        alert('not supported');
    }

    function error(msg) {
        console.log(msg);
    }

    function maps(position) {
        if($("#map_canvas").length != 0) {
            var user_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var styles = [
                {
                "featureType": "landscape.man_made",
                "stylers": [
                  { "color": "#fffff1" }
                ]
                },{
                "featureType": "transit.line",
                "stylers": [
                  { "visibility": "off" }
                ]
                },{
                "featureType": "landscape.natural",
                "stylers": [
                  { "color": "#f9edba" }
                ]
                },{
                },{
                "featureType": "water",
                "stylers": [
                  { "color": "#e4f4f3" }
                ]
                },{
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                  { "visibility": "off" }
                ]
                },{
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                  { "visibility": "off" }
                ]
                },{
                "featureType": "administrative.neighborhood",
                "elementType": "labels",
                "stylers": [
                  { "visibility": "off" }
                ]
                },{
                "featureType": "poi.park",
                "stylers": [
                  { "color": "#94cc99" },
                  { "lightness": 44 }
                ]
                },{
                "featureType": "poi.medical",
                "stylers": [
                  { "color": "#ea0f00" },
                  { "lightness": 92 }
                ]
                },{
                "featureType": "poi.business",
                "stylers": [
                  { "color": "#fffff3" }
                ]
                },{
                },{
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [
                  { "visibility": "off" }
                ]
                },{
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                  { "color": "#e6e7d2" },
                  { "lightness": 27 },
                  { "visibility": "off" }
                ]
                },{
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                  { "visibility": "on" },
                  { "color": "#f08f80" },
                  { "lightness": 77 }
                ]
                },{
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                  { "visibility": "on" },
                  { "color": "#e28080" },
                  { "lightness": 49 }
                ]
                },{
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                  { "visibility": "on" },
                  { "color": "#f08680" },
                  { "lightness": 77 }
                ]
                },{
                "featureType": "administrative.locality",
                "elementType": "labels.text.stroke",
                "stylers": [
                  { "visibility": "off" }
                ]
                },{
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                  { "color": "#000000" },
                  { "lightness": 72 }
                ]
                },{
                }
                ];

            var styledMap = new google.maps.StyledMapType(styles,
                {name: "Styled Map"});

            var mapOptions = {
                zoom: 14,
                center: user_location,
                mapTypeControl: false,
                streetViewControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            };
            var map = new google.maps.Map(document.getElementById('map_canvas'),
                mapOptions);

            var marker = new google.maps.Marker({
                position: user_location,
                map: map,
                title:"Current Location",
                animation: google.maps.Animation.DROP
            });

            // var infowindow = new google.maps.InfoWindow({
            //     content: '' +
            //         '<h2>R.T.S Ieper</h2>' +
            //         '<p class="googleMaps noBottom">Paddevijverstraat 56A <br/>8900 Ieper</p>' +
            //         '<div class="linkGoogleMaps"><a href="http://maps.google.com/maps?saddr=&daddr=' + rtsLocatie.toUrlValue() + '" target ="_blank">Navigatie naar R.T.S<\/a></div>'
            // });

            // google.maps.event.addListener(marker, 'click', function() {
            //     infowindow.open(map,marker);
            // })

            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');



        }
    }

})();

})();