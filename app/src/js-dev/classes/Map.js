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
                    console.log(data);
                    data.showPhotos = (type !== 'wcs');
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