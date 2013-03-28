(function () {

    var Map = function () {

        var Map = function (element) {
            this.element = element;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(maps, error);
            } else {
                alert('not supported');
            }
        };

        Map.prototype.error = function (msg) {
            var position = {
                'coords': {
                    'latitude': 51.227857,
                    'longitude': 2.925346,
                    'accuracy' : 666
                }
            };

            this.maps(position);
        };

        Map.prototype.generateMarker = function (color) {
            // body...
        };

        Map.prototype.maps = function (position) {
                if(this.element.length !== 0) {
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

                    var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        map: map,
                        icon: new google.maps.MarkerImage("img/current_location.png", null, null, null, new google.maps.Size(20,20)),
                        title:"Current Location",
                        optimized: false,
                        animation: google.maps.Animation.DROP
                    });

                    map.mapTypes.set('map_style', styledMap);
                    map.setMapTypeId('map_style');

                    $.getJSON(
                        server + 'Devine/_MAMP_JAAR2/_SEM2/MAIV/rolstende/api/all',
                        function (data) {
                            $.each(data.results.pointsofinterest, function() {
                                var obj = $(this);
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
                                    map: map,
                                    icon: new google.maps.MarkerImage("img/pin_orange.png", null, null, null, new google.maps.Size(20,20)),
                                    title: obj[0]["name"],
                                    animation: google.maps.Animation.DROP
                                });
                            });

                            $.each(data.results.restaurants, function() {
                                var obj = $(this);
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
                                    map: map,
                                    title: obj[0]["name"],
                                    icon: new google.maps.MarkerImage("img/pin_blueDark.png", null, null, null, new google.maps.Size(20,20)),
                                    animation: google.maps.Animation.DROP
                                });
                            });

                            $.each(data.results.wcs, function() {

                                var obj = $(this);
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
                                    map: map,
                                    title: obj[0]["name"],
                                    icon: new google.maps.MarkerImage("img/pin_blue.png", null, null, null, new google.maps.Size(20,20)),
                                    animation: google.maps.Animation.DROP
                                });
                            });

                            $.each(data.results.hotels, function() {

                                var obj = $(this);
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
                                    map: map,
                                    title: obj[0]["name"],
                                    icon: new google.maps.MarkerImage("img/pin_red.png", null, null, null, new google.maps.Size(20,20)),
                                    animation: google.maps.Animation.DROP
                                });
                            });
                        }
                    })
                }
            }

        };

}());

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(maps, error);
    // } else {
    //     alert('not supported');
    // }

    // function error(msg) {
    //     console.log(msg);
    //     var position = {'coords': {'latitude' : 51.227857, 'longitude' : 2.925346, 'accuracy' : 666}};
    //     maps(position);
    // }

    // function maps(position) {
    //     if($("#map_canvas").length != 0) {
    //         var user_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    //         var styles = [
    //             {
    //             "featureType": "landscape.man_made",
    //             "stylers": [
    //               { "color": "#fffff1" }
    //             ]
    //             },{
    //             "featureType": "transit.line",
    //             "stylers": [
    //               { "visibility": "off" }
    //             ]
    //             },{
    //             "featureType": "landscape.natural",
    //             "stylers": [
    //               { "color": "#f9edba" }
    //             ]
    //             },{
    //             },{
    //             "featureType": "water",
    //             "stylers": [
    //               { "color": "#e4f4f3" }
    //             ]
    //             },{
    //             "featureType": "road",
    //             "elementType": "labels",
    //             "stylers": [
    //               { "visibility": "off" }
    //             ]
    //             },{
    //             "featureType": "poi",
    //             "elementType": "labels",
    //             "stylers": [
    //               { "visibility": "off" }
    //             ]
    //             },{
    //             "featureType": "administrative.neighborhood",
    //             "elementType": "labels",
    //             "stylers": [
    //               { "visibility": "off" }
    //             ]
    //             },{
    //             "featureType": "poi.park",
    //             "stylers": [
    //               { "color": "#94cc99" },
    //               { "lightness": 44 }
    //             ]
    //             },{
    //             "featureType": "poi.medical",
    //             "stylers": [
    //               { "color": "#ea0f00" },
    //               { "lightness": 92 }
    //             ]
    //             },{
    //             "featureType": "poi.business",
    //             "stylers": [
    //               { "color": "#fffff3" }
    //             ]
    //             },{
    //             },{
    //             "featureType": "road.local",
    //             "elementType": "geometry.stroke",
    //             "stylers": [
    //               { "visibility": "off" }
    //             ]
    //             },{
    //             "featureType": "road.local",
    //             "elementType": "geometry.fill",
    //             "stylers": [
    //               { "color": "#e6e7d2" },
    //               { "lightness": 27 },
    //               { "visibility": "off" }
    //             ]
    //             },{
    //             "featureType": "road.highway",
    //             "elementType": "geometry.fill",
    //             "stylers": [
    //               { "visibility": "on" },
    //               { "color": "#f08f80" },
    //               { "lightness": 77 }
    //             ]
    //             },{
    //             "featureType": "road.highway",
    //             "elementType": "geometry.stroke",
    //             "stylers": [
    //               { "visibility": "on" },
    //               { "color": "#e28080" },
    //               { "lightness": 49 }
    //             ]
    //             },{
    //             "featureType": "road.arterial",
    //             "elementType": "geometry.fill",
    //             "stylers": [
    //               { "visibility": "on" },
    //               { "color": "#f08680" },
    //               { "lightness": 77 }
    //             ]
    //             },{
    //             "featureType": "administrative.locality",
    //             "elementType": "labels.text.stroke",
    //             "stylers": [
    //               { "visibility": "off" }
    //             ]
    //             },{
    //             "featureType": "administrative.locality",
    //             "elementType": "labels.text.fill",
    //             "stylers": [
    //               { "color": "#000000" },
    //               { "lightness": 72 }
    //             ]
    //             },{
    //             }
    //             ];

    //         var styledMap = new google.maps.StyledMapType(styles,
    //             {name: "Styled Map"});

    //         map = styledMap;

    //         var mapOptions = {
    //             zoom: 14,
    //             center: user_location,
    //             mapTypeControl: false,
    //             streetViewControl: false,
    //             mapTypeControlOptions: {
    //                 mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    //             }
    //         };
    //         map = new google.maps.Map(document.getElementById('map_canvas'),
    //             mapOptions);

    //         var marker = new google.maps.Marker({
    //             position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    //             map: map,
    //             icon: new google.maps.MarkerImage("img/current_location.png", null, null, null, new google.maps.Size(20,20)),
    //             title:"Current Location",
    //             optimized: false,
    //             animation: google.maps.Animation.DROP
    //         });

    //         // var infowindow = new google.maps.InfoWindow({
    //         //     content: '' +
    //         //         '<h2>R.T.S Ieper</h2>' +
    //         //         '<p class="googleMaps noBottom">Paddevijverstraat 56A <br/>8900 Ieper</p>' +
    //         //         '<div class="linkGoogleMaps"><a href="http://maps.google.com/maps?saddr=&daddr=' + rtsLocatie.toUrlValue() + '" target ="_blank">Navigatie naar R.T.S<\/a></div>'
    //         // });

    //         // google.maps.event.addListener(marker, 'click', function() {
    //         //     infowindow.open(map,marker);
    //         // })

    //         map.mapTypes.set('map_style', styledMap);
    //         map.setMapTypeId('map_style');



    //     }

    //     drawAll();
    // }

    // function drawAll() {
    //     console.log('bingo');
    //     $.ajax({
    //         type: 'get',
    //         url: server + 'api/all',
    //         dataType: 'json',
    //         success: function(data) {
    //             clearOverlays();
    //             $.each(data.results.pointsofinterest, function() {
    //                 var obj = $(this);
    //                 var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
    //                     map: map,
    //                     icon: new google.maps.MarkerImage("img/pin_orange.png", null, null, null, new google.maps.Size(20,20)),
    //                     title: obj[0]["name"],
    //                     animation: google.maps.Animation.DROP,
    //                     id: "pointofinterest-" + obj[0]["id"]
    //                 });

    //                 markersArray.push(marker);
    //                 google.maps.event.addListener(marker, 'click', function(event) {
    //                     markerClicked(marker);
    //                 });
    //             });

    //             $.each(data.results.restaurants, function() {
    //                 var obj = $(this);
    //                 var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
    //                     map: map,
    //                     title: obj[0]["name"],
    //                     icon: new google.maps.MarkerImage("img/pin_blueDark.png", null, null, null, new google.maps.Size(20,20)),
    //                     animation: google.maps.Animation.DROP,
    //                     id: "restaurant-" + obj[0]["id"]
    //                 });

    //                 markersArray.push(marker);  
    //                 google.maps.event.addListener(marker, 'click', function(event) {
    //                     markerClicked(marker);
    //                 });
    //             });

    //             $.each(data.results.wcs, function() {

    //                 var obj = $(this);
    //                 var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
    //                     map: map,
    //                     title: obj[0]["name"],
    //                     icon: new google.maps.MarkerImage("img/pin_blue.png", null, null, null, new google.maps.Size(20,20)),
    //                     animation: google.maps.Animation.DROP,
    //                     id: "wc-" + obj[0]["id"]
    //                 });

    //                 markersArray.push(marker);
    //                 google.maps.event.addListener(marker, 'click', function(event) {
    //                     markerClicked(marker);
    //                 });
    //             });

    //             $.each(data.results.hotels, function() {

    //                 var obj = $(this);
    //                 var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
    //                     map: map,
    //                     title: obj[0]["name"],
    //                     icon: new google.maps.MarkerImage("img/pin_red.png", null, null, null, new google.maps.Size(20,20)),
    //                     animation: google.maps.Animation.DROP,
    //                     id: "hotel-" + obj[0]["id"]
    //                 });

    //                 markersArray.push(marker);
    //                 google.maps.event.addListener(marker, 'click', function(event) {
    //                     markerClicked(marker);
    //                 });
    //             });
    //         }
    //     });
    // }

    // function markerClicked(marker) {
    //     var id = marker.id;
    //     var substr = id.split('-');
    //     var type = substr[0];
    //     var db_id = substr[1];

    //     $.ajax({
    //         type: 'get',
    //         url: server + 'api/' + type + '/'  + db_id,
    //         success: function(data) {
    //             console.log(data);
    //         }
    //     });
    // }

    // function clearOverlays() {
    //     for (var i = 0; i < markersArray.length; i++ ) {
    //         markersArray[i].setMap(null);
    //     }
    // }

    // //Map updaten adhv checkboxes
    // // $(".changeMap").change(function() {
    // //     if($(".changeMap:checked").length == 4) {
    // //         drawAll();
    // //     } else {
    // //         $(".changeMap:checked").each(function() {
    // //             var identifier = "",
    // //                 pin_kleur = "";

    // //             switch($(this).attr('name')) {
    // //                 case 'hotels':
                        
    // //                     break;
    // //             }
    // //             $.ajax({
    // //                 type: 'get',
    // //                 url: server + 'api/' + $(this).attr('name'),
    // //                 success: function(data) {
    // //                     clearOverlays();
    // //                     $.each(data.results.hotels, function() {
    // //                         var obj = $(this);
    // //                         var marker = new google.maps.Marker({
    // //                             position: new google.maps.LatLng(obj[0]["latitude"], obj[0]["longitude"]),
    // //                             map: map,
    // //                             title: obj[0]["name"],
    // //                             icon: new google.maps.MarkerImage("img/pin_red.png", null, null, null, new google.maps.Size(20,20)),
    // //                             animation: google.maps.Animation.DROP,
    // //                             id: "hotel-" + obj[0]["id"]
    // //                         });

    // //                         markersArray.push(marker);
    // //                         google.maps.event.addListener(marker, 'click', function(event) {
    // //                             markerClicked(marker);
    // //                         });
    // //                     });
    // //                 }
    // //             });
    // //         });
    // //     }
    // // });