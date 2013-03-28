(function () {

"use strict";

(function () {
    var Calendar = function () {

        var Calendar = function () {
            this.today = new Date();
            this.month = this.today.getMonth();
        };

        return Calendar;
    };
}());

var RolstendeMap = (function () {

    var RolstendeMap = function (element) {
        this.element = element;
        this.map = null;
        this.markers = [];

        var that = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                that.maps(position);
            }, this.error);
        } else {
            this.error();
        }
    };

    RolstendeMap.prototype.error = function (msg) {
        var position = {
            'coords': {
                'latitude': 51.227857,
                'longitude': 2.925346,
                'accuracy' : 666
            }
        };

        this.maps(position);
    };

    RolstendeMap.prototype.maps = function (position) {
        console.log('maps');
        if (this.element.length === 0) {
            return false;
        }

        var user_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var styles = [{"featureType": "landscape.man_made","stylers": [{ "color": "#fffff1" }]},{"featureType": "transit.line","stylers": [{ "visibility": "off" }]},{"featureType": "landscape.natural","stylers": [{ "color": "#f9edba" }]},{},{"featureType": "water","stylers": [{ "color": "#e4f4f3" }]},{"featureType": "road","elementType": "labels","stylers": [{ "visibility": "off" }]},{"featureType": "poi","elementType": "labels","stylers": [{ "visibility": "off" }]},{"featureType": "administrative.neighborhood","elementType": "labels","stylers": [{ "visibility": "off" }]},{"featureType": "poi.park","stylers": [{ "color": "#94cc99" },{ "lightness": 44 }]},{"featureType": "poi.medical","stylers": [{ "color": "#ea0f00" },{ "lightness": 92 }]},{"featureType": "poi.business","stylers": [{ "color": "#fffff3" }]},{},{"featureType": "road.local","elementType": "geometry.stroke","stylers": [{ "visibility": "off" }]},{"featureType": "road.local","elementType": "geometry.fill","stylers": [{ "color": "#e6e7d2" },{ "lightness": 27 },{ "visibility": "off" }]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{ "visibility": "on" },{ "color": "#f08f80" },{ "lightness": 77 }]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{ "visibility": "on" },{ "color": "#e28080" },{ "lightness": 49 }]},{"featureType": "road.arterial","elementType": "geometry.fill","stylers": [{ "visibility": "on" },{ "color": "#f08680" },{ "lightness": 77 }]},{"featureType": "administrative.locality","elementType": "labels.text.stroke","stylers": [{ "visibility": "off" }]},{"featureType": "administrative.locality","elementType": "labels.text.fill","stylers": [{ "color": "#000000" },{ "lightness": 72 }]},{}];

        var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

        var mapOptions = {
            zoom: 14,
            center: user_location,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            map: this.map,
            icon: new google.maps.MarkerImage("img/current_location.png", null, null, null, new google.maps.Size(20,20)),
            title:"Current Location",
            optimized: false,
            animation: google.maps.Animation.DROP
        });

        this.map.mapTypes.set('map_style', styledMap);
        this.map.setMapTypeId('map_style');

        this.setMarkers();
    };

    RolstendeMap.prototype.generateMarker = function (object, category) {
        var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(object[0]["latitude"], object[0]["longitude"]),
                        map: this.map,
                        icon: new google.maps.MarkerImage("img/pin_orange.png", null, null, null, new google.maps.Size(20,20)),
                        title: object[0]["name"],
                        animation: google.maps.Animation.DROP,
                        id: category + '-' + obj[0]["id"]
                    });
    };

    RolstendeMap.prototype.setMarkers = function () {
        var that = this;
        $.getJSON(
            'http://192.168.2.9/Devine/_MAMP_JAAR2/_SEM2/MAIV/rolstende/' + 'api/all',
            function (data) {
                // clearOverlays();

                $.each(data.results, function (key, value) {
                    var category = key;

                    $.each(value, function () {
                        var obj = $(this);
                        var marker = that.generateMarker(obj, category);
                        that.markers.push(marker);
                        google.maps.event.addListener(marker, 'click', function (event) {
                            that.markerClickHandler(marker);
                        });
                    });
                });
            }
        );
    };

    RolstendeMap.prototype.markerClickHandler = function (marker) {
        var id = marker.id,
            substr = id.split('-'),
            type = substr[0],
            db_id = substr[1];

        $.ajax({
            type: 'get',
            url: server + 'api/' + type + '/'  + db_id,
            success: function(data) {
                console.log(data);
            }
        });
    };

    return RolstendeMap;

})();

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

    var map = new RolstendeMap($('#map_canvas'));

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

})();