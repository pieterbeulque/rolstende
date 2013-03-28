(function () {

"use strict";

var Calendar = (function () {

    var Calendar = function (element) {
        this.element = element;
        this.heading = element.find('.calendar-heading h2');
        this.table = element.find('.calendar-table');
        this.today = new Date();
        this.counter = new Date();

        this.fillTable();
    };

    Calendar.prototype.readableMonth = function () {
        switch (this.counter.getMonth()) {
            case 0:
                return 'Januari';
            case 1:
                return 'Februari';
            case 2:
                return 'Maart';
            case 3:
                return 'April';
            case 4:
                return 'Mei';
            case 5:
                return 'Juni';
            case 6:
                return 'Juli';
            case 7:
                return 'Augustus';
            case 8:
                return 'September';
            case 9:
                return 'Oktober';
            case 10:
                return 'November';
            case 11:
                return 'December';
        }
    };

    Calendar.prototype.fillTable = function () {
        var beginDay = new Date(this.counter.getFullYear(), this.counter.getMonth(), 1).getDay() - 1,
            daysInMonth = new Date(this.counter.getFullYear(), this.counter.getMonth() + 1, 0).getDate();

        beginDay = (beginDay < 0) ? 6 : beginDay; // Reset it to monday = 0 and sunday = 6

        var cells = this.table.find('td').empty(),
            eqCounter = beginDay;

        for (var i = 1; i <= daysInMonth; i++) {
            cells.eq(eqCounter).html(i);
            eqCounter++;
        }

        $('.today').removeClass('today');

        if (this.today.getMonth() === this.counter.getMonth() && this.today.getFullYear() === this.counter.getFullYear()) {
            cells.eq(this.today.getDate() + beginDay - 1).addClass('today');
        }

        this.heading.html(this.readableMonth() + ' ' + this.counter.getFullYear());
    };

    Calendar.prototype.nextMonth = function () {
        this.counter.setMonth(this.counter.getMonth() + 1);
        this.fillTable();
    };

    Calendar.prototype.previousMonth = function () {
        this.counter.setMonth(this.counter.getMonth() - 1);
        this.fillTable();
    };

    return Calendar;

}());

var Dropdown = (function () {

    var Dropdown = function () {
      if ( $.fn.makisu.enabled ) {
            var open = false;


            var $maki = $( '.maki' ),
                $dt = $('.info, dd');

            $dt.click(function() {
                if(open) {
                    $maki.makisu('close');
                    open = false;
                    setTimeout(function(){
                    	   $("#dropdown-container").css({'top': '0px'}).delay(500).stop().animate({'top' : '-60px'});
                    	}, 1000);
                 
                } else {
               
                	$("#dropdown-container").css({'top': '-60px'}).stop().animate({'top' : '0px'}, 500, function(){
                		$maki.makisu('open');
                   		open = true;
                	});
                    
                }
            });

            // Create Makisus
            $maki.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.85
            });

            // Open all
            

            // Toggle on click

            $( '.toggle' ).on( 'click', function() {
                $( '.list' ).makisu( 'toggle' );
            });

            // Disable all links

            $( '.demo a' ).click( function( event ) {
                event.preventDefault();
            });

        } else {
            $( '.warning' ).show();
        }
        
    };


 // The `enabled` flag will be `false` if CSS 3D isn't available



    return Dropdown;
})();

var RolstendeMap = (function () {

    var RolstendeMap = function (element) {
        this.element = element;
        this.map = null;
        this.rawmarkers = [];
        this.markers = {};
        this.showMyLocation = true;
        this.userLocation = {};
        this.settings = new Settings();

        var that = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                that.maps(position);
            }, function (msg) {
                that.error(msg);
            });
        } else {
            this.error();
        }

        $(".changeMap").change(function() {
            that.checkMarkers();
        });
    };

    RolstendeMap.prototype.error = function (msg) {
        var position = {
            'coords': {
                'latitude': 51.231613,
                'longitude': 2.923822,
                'accuracy' : 666
            }
        };
        this.showMyLocation = false;
        this.maps(position);
    };

    RolstendeMap.prototype.maps = function (position) {
        console.log('maps');
        if (this.element.length === 0) {
            return false;
        }

        this.userLocation = position.coords;
        var user_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var styles = [{"featureType": "landscape.man_made","stylers": [{ "color": "#fffff1" }]},{"featureType": "transit.line","stylers": [{ "visibility": "off" }]},{"featureType": "landscape.natural","stylers": [{ "color": "#f9edba" }]},{},{"featureType": "water","stylers": [{ "color": "#e4f4f3" }]},{"featureType": "road","elementType": "labels","stylers": [{ "visibility": "off" }]},{"featureType": "poi","elementType": "labels","stylers": [{ "visibility": "off" }]},{"featureType": "administrative.neighborhood","elementType": "labels","stylers": [{ "visibility": "off" }]},{"featureType": "poi.park","stylers": [{ "color": "#94cc99" },{ "lightness": 44 }]},{"featureType": "poi.medical","stylers": [{ "color": "#ea0f00" },{ "lightness": 92 }]},{"featureType": "poi.business","stylers": [{ "color": "#fffff3" }]},{},{"featureType": "road.local","elementType": "geometry.stroke","stylers": [{ "visibility": "off" }]},{"featureType": "road.local","elementType": "geometry.fill","stylers": [{ "color": "#e6e7d2" },{ "lightness": 27 },{ "visibility": "off" }]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{ "visibility": "on" },{ "color": "#f08f80" },{ "lightness": 77 }]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{ "visibility": "on" },{ "color": "#e28080" },{ "lightness": 49 }]},{"featureType": "road.arterial","elementType": "geometry.fill","stylers": [{ "visibility": "on" },{ "color": "#f08680" },{ "lightness": 77 }]},{"featureType": "administrative.locality","elementType": "labels.text.stroke","stylers": [{ "visibility": "off" }]},{"featureType": "administrative.locality","elementType": "labels.text.fill","stylers": [{ "color": "#000000" },{ "lightness": 72 }]},{}];

        var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

        var mapOptions = {
            zoom: 13,
            center: user_location,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        if(this.showMyLocation) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                map: this.map,
                icon: new google.maps.MarkerImage("img/current_location.png", null, null, null, new google.maps.Size(20,20)),
                title:"Current Location",
                optimized: false,
                animation: google.maps.Animation.DROP
            });

            this.rawmarkers.push(marker);
        }

        this.map.mapTypes.set('map_style', styledMap);
        this.map.setMapTypeId('map_style');

        this.setMarkers();
    };

    RolstendeMap.prototype.checkMarkers = function () {
        var that = this;

        $('input[type="checkbox"]:not(:checked)').each(function () {
            $.each(that.markers[$(this).attr('name')], function() {
                $(this)[0].setMap(null);
            });
        });

        $('input[type="checkbox"]:checked').each(function () {
            $.each(that.markers[$(this).attr('name')], function() {
                $(this)[0].setMap(that.map);
            });
        });
    };

    RolstendeMap.prototype.generateMarker = function (object, category) {
        var path;
        switch(category) {
            case 'restaurants':
                path = "img/pin_blueDark.png";
                break;

            case 'hotels':
                path = "img/pin_red.png";
                break;

            case 'pointsofinterest':
                path = "img/pin_orange.png";
                break;

            case 'wcs':
                path = "img/pin_blue.png";
                break;
        }

        var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(object[0]["latitude"], object[0]["longitude"]),
                        map: this.map,
                        icon: new google.maps.MarkerImage(path, null, null, null, new google.maps.Size(20,20)),
                        title: object[0]["name"],
                        animation: google.maps.Animation.DROP,
                        id: category + '-' + object[0]["id"]
                    });

        return marker;
    };

    RolstendeMap.prototype.setMarkers = function () {
        var that = this;
        $.getJSON(
            this.settings.api + 'all',
            function (data) {
                // clearOverlays();

                $.each(data.results, function (key, value) {
                    var category = key;
                    that.markers[category] = [];

                    $.each(value, function () {
                        var obj = $(this);
                        var marker = that.generateMarker(obj, category);
                        that.markers[category].push(marker);
                        that.rawmarkers.push(marker);
                        google.maps.event.addListener(marker, 'click', function (event) {
                            that.markerClickHandler(marker);
                        });
                    });
                });

                var fullBounds = new google.maps.LatLngBounds();
                for (var i = 0; i < that.rawmarkers.length; i++){
                    var latitude = parseFloat(that.rawmarkers[i]["position"]["jb"]);
                    var longitude = parseFloat(that.rawmarkers[i]["position"]["kb"]);
                    var point = new google.maps.LatLng(latitude,longitude);

                    fullBounds.extend(point);
                }

                that.map.fitBounds(fullBounds);

            }
        );

    };

    RolstendeMap.prototype.markerClickHandler = function (marker) {

        var id = marker.id,
            substr = id.split('-'),
            type = substr[0],
            db_id = substr[1],
            that = this;

            $.ajax({
                type: 'get',
                url: this.settings.api + type + '/'  + db_id,
                dataType:'json',
                success: function(data) {
                    var template = $('#listDetailTemplate').html();
                    var html = Mustache.to_html(template, data);
                    $('#results').html(html).removeClass('hide');

                    if(!that.showMyLocation) {
                        $(".location a").attr('href', 'maps:ll=' + that.userLocation.latitude + ',' + that.userLocation.longitude);
                    } else {
                        $(".location a").attr('href', 'maps:saddr=' + that.userLocation.latitude + ',' + that.userLocation.longitude + '&daddr='+data["latitude"]+','+data["longitude"]+'&z=12');
                    }

                    $('#app').animate({
                        scrollTop: $(".detail-view").offset().top
                    }, 1000);
                }
            });
    };

    RolstendeMap.prototype.calculateDistance = function(p1, p2) {
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
    };

    return RolstendeMap;

})();

var Settings =(function () {

    var Settings = function () {
        this.api = 'http://192.168.2.9/Devine/_MAMP_JAAR2/_SEM2/MAIV/rolstende/api/'
    };

    return Settings;

})();

(function () {

    var loadSidebar = function () {
        var sv = new SlidingView( 'sidebar', 'app' );

        sv.sidebar.oriDomi({ hPanels: 1, vPanels: 2, speed:1, perspective:1000, shadingIntensity:2 });
        sv.sidebar.oriDomi('accordion', 45);

        sv.sidebar.on('slidingViewProgress', function(event, data) {
            var fudge = 1,
                half = data.max/2;

            if ( data.current < half ) {
                fudge = (data.current)/half;
            } else if ( data.current > half ) {
                fudge = (half-(data.current-half))/half;
            }

            fudge *= 15;

            var angle = 90-((90*(data.current/data.max)));

            if ( (angle+fudge) > 0 ) {
                sv.sidebar.oriDomi( 'restoreOriDomi' );
                sv.sidebar.oriDomi( 'accordion', (angle+fudge) );
            } else {
                sv.sidebar.oriDomi( 'restoreDOM' );
            }
        });
    };

    var loadMap = function () {
        var map = new RolstendeMap($('#map_canvas'));
    };

    var loadInfo = function () {
        var dropdown = new Dropdown();
    };

    var loadCalendar = function () {
        var calendar = new Calendar($('#calendar'));

        $('#calendar-prev').on('click', function () {
            calendar.previousMonth();
            return false;
        });

        $('#calendar-next').on('click', function () {
            calendar.nextMonth();
            return false;
        });
    };

    var initNavigation = function () {
        $('#app-wrapper').on('click', '#sidebar a', function (e) {
            var template,
                partials = {
                    header: $('#headerTemplate').html()
                },
                html;

            switch ($(this).attr('href')) {
                case '#events':
                    template = $('#calendarTemplate').html();
                    html = Mustache.to_html(template, {switchClass: 'hide'}, partials);
                    $('#app').html(html);
                    loadCalendar();
                    break;

                case '#spots':
                    template = $('#mapTemplate').html();
                    html = Mustache.to_html(template, {switchClass: 'active'}, partials);
                    $('#app').html(html);
                    loadMap();
                    break;

                case '#info':
                    template = $('#infoTemplate').html();
                    html = Mustache.to_html(template, {switchClass: 'hide'}, partials);
                    $('#app').html(html);
                    loadInfo();
                    break;
            }

            return false;
        });

        $('#app').on('click', '.grid-item a', function () {
            console.log($(this).attr('href'));

            var template = $('#listTemplate').html(),
                partials = {
                    result: $('#listDetailTemplate').html()
                },
                info = {},
                html,
                settings = new Settings();

            switch ($(this).attr('href')) {
                case '#list-wcs':
                    info.headingClass = 'heading-wcs';
                    info.color = 'blue';
                    info.results = [{
                        name: 'Test',
                        description: 'Mustache',
                        address: 'Schoolkaai 40',
                        phone: '0579608770',
                        latitude: 2,
                        longitude: 2
                    }];
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'wcs',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                        }
                    });
                    $('body').attr('class', '').addClass('blue-wood');
                    break;

                case '#list-poi':
                    info.headingClass = 'heading-bezienswaardigheden';
                    info.color = 'orange';
                    info.results = [{
                        name: 'Test',
                        description: 'Mustache',
                        address: 'Schoolkaai 40',
                        phone: '0579608770',
                        latitude: 2,
                        longitude: 2
                    }];
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'points_of_interest',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                        }
                    });
                    $('body').attr('class', '').addClass('orange-wood');
                    break;

                case '#list-restaurants':
                    info.headingClass = 'heading-restaurants';
                    info.color = 'blue';
                    info.results = [{
                        name: 'Test',
                        description: 'Mustache',
                        address: 'Schoolkaai 40',
                        phone: '0579608770',
                        latitude: 2,
                        longitude: 2
                    }];
                    $('body').attr('class', '').addClass('blue-wood');
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'restaurants',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                        }
                    });
                    break;

                case '#list-hotels':
                    info.headingClass = 'heading-hotels';
                    info.color = 'red';
                    info.results = [{
                        name: 'Test',
                        description: 'Mustache',
                        address: 'Schoolkaai 40',
                        phone: '0579608770',
                        latitude: 2,
                        longitude: 2
                    }];
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'hotels',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                        }
                    });
                    $('body').attr('class', '').addClass('red-wood');
                    break;

            }

            html = Mustache.to_html(template, info, partials);
            $('#app').html(html);

            return false;
        });

        $('#app').on('click', '.back-button', function () {
            var template = $('#indexTemplate').html();
            var html = Mustache.to_html(template, {switchClass: ''}, {header: $('#headerTemplate').html()});
            $('#app').html(html);

            $('body').attr('class', '');

            return false;
        });

        $("#app").on('click', '.switch', function() {
            if($(this).hasClass('active')) {
                loadIndex();
            } else {
                var template,
                partials = {
                    header: $('#headerTemplate').html()
                },
                html;
                
                template = $('#mapTemplate').html();
                html = Mustache.to_html(template, {switchClass: 'active'}, partials);
                $('#app').html(html);
                loadMap();
            }
        });

    };

    var init = function () {
        loadIndex();

        loadSidebar();
        initNavigation();
    };

    var loadIndex = function() {
        var template = $('#indexTemplate').html();
        var html = Mustache.to_html(template, {switchClass: ''}, {header: $('#headerTemplate').html()});
        $('#app').html(html);
    }

    init();

    var server = "http://192.168.2.9/Devine/_MAMP_JAAR2/_SEM2/MAIV/rolstende/";

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

})();

})();