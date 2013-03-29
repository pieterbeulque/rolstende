(function () {

"use strict";

var App = (function () {

    var App = function () {
        this.sv = new SlidingView('sidebar', 'app');

        this.showMap = false;

        this.loadIndex();

        this.loadSidebar();
        this.initNavigation();
    };

    App.prototype.loadSidebar = function () {
        var that = this;

        that.sv.sidebar.oriDomi({ hPanels: 1, vPanels: 2, speed:1, perspective:1000, shadingIntensity:2 });
        that.sv.sidebar.oriDomi('accordion', 45);

        that.sv.sidebar.on('slidingViewProgress', function(event, data) {
            var fudge = 1,
                half = data.max/2;

            if (data.current < half) {
                fudge = (data.current) / half;
            } else if (data.current > half) {
                fudge = (half-(data.current-half))/half;
            }

            fudge *= 15;

            var angle = 90-((90*(data.current/data.max)));

            if ( (angle+fudge) > 0 ) {
                that.sv.sidebar.oriDomi( 'restoreOriDomi' );
                that.sv.sidebar.oriDomi( 'accordion', (angle+fudge) );
            } else {
                that.sv.sidebar.oriDomi( 'restoreDOM' );
            }
        });

        // $("#app").on('click', function() {
        //     sv.close();
        // });
    };

    App.prototype.loadMap = function () {
        if($(".switch-button").hasClass('active')) {
            var map = new RolstendeMap($('#map_canvas'));
            this.showMap = true;
        }
    };

    App.prototype.loadInfo = function () {
        var dropdown = new Dropdown();
        var validate = new Validate();
    };

    App.prototype.loadCalendar = function () {
        var calendar = new Calendar($('#calendar'));
        var validate = new Validate();

        $('#calendar-prev').on('click', function () {
            calendar.previousMonth();
            return false;
        });

        $('#calendar-next').on('click', function () {
            calendar.nextMonth();
            return false;
        });
    };

    App.prototype.listView = function (data) {
        var listview = new Listview($(".list-view"), data);
    };

    App.prototype.initNavigation = function () {
        var that = this;

        $('#app-wrapper').on('click', '#sidebar a', function (e) {
            $("#ajax-loader").html('<div class="pendulum-container"><div class="pendulum"></div></div>');
            $('body').attr('class', '');
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
                    that.loadCalendar();
                    break;

                case '#spots':
                    if (that.showMap === true) {
                        template = $('#mapTemplate').html();
                        html = Mustache.to_html(template, {switchClass: 'active'}, partials);
                        $('#app').html(html);
                        that.loadMap();
                    } else {
                        that.loadIndex();
                    }
                    break;

                case '#info':
                    template = $('#infoTemplate').html();
                    html = Mustache.to_html(template, {switchClass: 'hide'}, partials);
                    $('#app').html(html);
                    that.loadInfo();
                    break;
            }
            $("#ajax-loader").html('');
            $('#app').click();
            return false;
        });

        $('#app').on('click', '.grid-item a', function () {
            $("#ajax-loader").html('<div class="pendulum-container"><div class="pendulum"></div></div>');
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
                    info.statusLocatie = 'hide';
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'wcs',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                            that.listView(data);
                            $("#ajax-loader").html('');
                        }
                    });
                    $('body').attr('class', '').addClass('blue-wood');
                    break;

                case '#list-poi':
                    info.headingClass = 'heading-bezienswaardigheden';
                    info.statusLocatie = 'hide';
                    info.color = 'orange';
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'pointsofinterest',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                            that.listView(data);
                            $("#ajax-loader").html('');
                        }
                    });
                    $('body').attr('class', '').addClass('orange-wood');
                    break;

                case '#list-restaurants':
                    info.headingClass = 'heading-restaurants';
                    info.color = 'blue';
                    info.statusLocatie = 'list-view-annotation';
                    $('body').attr('class', '').addClass('blue-wood');
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'restaurants',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                            that.listView(data);
                            $("#ajax-loader").html('');
                        }
                    });
                    break;

                case '#list-hotels':
                    info.headingClass = 'heading-hotels';
                    info.color = 'red';
                    info.statusLocatie = 'list-view-annotation';
                    $.ajax({
                        type: 'get',
                        url: settings.api + 'hotels',
                        success: function(data) {
                            info.results = data.results;
                            html = Mustache.to_html(template, info, partials);
                            $('#app').html(html);
                            that.listView(data);
                            $("#ajax-loader").html('');
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
            $("#ajax-loader").html('');
            var template = $('#indexTemplate').html();
            var html = Mustache.to_html(template, {switchClass: ''}, {header: $('#headerTemplate').html()});
            $('#app').html(html);

            $('body').attr('class', '');

            return false;
        });

        $("#app").on('click', '.switch-button a', function() {
            if($(this).parent().hasClass('active')) {
                that.loadIndex();
            } else {
                var template,
                partials = {
                    header: $('#headerTemplate').html()
                },
                html;

                template = $('#mapTemplate').html();
                html = Mustache.to_html(template, {switchClass: 'active'}, partials);
                $('#app').html(html);
                that.loadMap();
            }
        });

    };

    App.prototype.loadIndex = function() {
        this.showMap = false;
        var template = $('#indexTemplate').html();
        var html = Mustache.to_html(template, {switchClass: ''}, {header: $('#headerTemplate').html()});
        $('#app').html(html);
    };

    return App;

})();

var Calendar = (function () {

    var Calendar = function (element) {
        this.element = element;
        this.heading = element.find('.calendar-heading h2');
        this.table = element.find('.calendar-table');
        this.today = new Date();
        this.counter = new Date();
        this.settings = new Settings();
        this.events = [];

        var that = this;

        this.table.on('click', 'a', function () {
            var date = parseInt($(this).attr('href').substr(7), 10),
                showFromStart = true,
                showFromEnd = true,
                events = [];

            $.each(that.events, function (key, value) {
                var startDate = that.dateFromMySQL(value.start),
                    endDate = that.dateFromMySQL(value.end);

                if (startDate.getMonth() === that.counter.getMonth()) {
                    showFromStart = (startDate.getDate() <= date);
                }

                if (endDate.getMonth() === that.counter.getMonth()) {
                    showFromEnd = (endDate.getDate() >= date);
                }

                if (showFromStart && showFromEnd) {
                    events.push(value);
                }
            });

            var template = $('#calendarListTemplate').html();
            var html = Mustache.to_html(template, {results: events}, {
                result: $('#calendarDetailTemplate').html()
            });
            $('.results').html(html);

            return false;
        });

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

    Calendar.prototype.dateFromMySQL = function (datetime) {
        var t = datetime.split(/[- :]/),
            d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

        return d;
    };

    Calendar.prototype.getEvents = function () {
        var that = this;
        $.getJSON(
            this.settings.api + 'events/for/' + this.counter.getFullYear() + '/' + (this.counter.getMonth() + 1),
            function (data) {
                that.events = data.results;
                that.showEvents();
            }
        );
    };

    Calendar.prototype.showEvents = function () {
        var beginDay = this.getBeginDay(),
            daysInMonth = this.getDaysInMonth(),
            that = this;

        $.each(this.events, function (key, value) {
            var start = that.dateFromMySQL(value.start),
                end = that.dateFromMySQL(value.end),
                i,
                max;

            // Start ligt in huidige maand
            if (start.getMonth() === that.counter.getMonth()) {
                i = start.getDate() - 1;

                // If end day smaller than big date, end is in next month, so set it to end of month
                max = (end.getDate() < start.getDate()) ? daysInMonth : end.getDate();
            } else {
                // Start ligt in vorige maand
                i = 0;

                max = end.getDate();
            }

            var cells = that.table.find('td');

            for (i; i < max; i++) {
                var index = i + beginDay;
                cells.eq(index).html('<a href="#event-' + (i + 1)    + '">' + (i + 1) + '</a>');
            }
        });
    };

    Calendar.prototype.getBeginDay = function () {
        var beginDay = new Date(this.counter.getFullYear(), this.counter.getMonth(), 1).getDay() - 1;
        beginDay = (beginDay < 0) ? 6 : beginDay; // Reset it to monday = 0 and sunday = 6
        return beginDay;
    };

    Calendar.prototype.getDaysInMonth = function () {
        return new Date(this.counter.getFullYear(), this.counter.getMonth() + 1, 0).getDate();
    };

    Calendar.prototype.fillTable = function () {
        var beginDay = this.getBeginDay(),
            daysInMonth = this.getDaysInMonth();

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

        this.getEvents();
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

            var $maki = $('.maki'),
                $dt = $('.info-button, dd');

            $dt.click(function() {
                if(open) {
                    $('.list').show();
                    $maki.makisu('close');
                    open = false;

                    setTimeout(function() {
                    $("#dropdown-container").css({'top': '0px'}).delay(1000).stop().animate({'top' : '-60px'}, function() {             
                       $("#dropdown-container").css({'visibility': 'hidden'});
                    });

                    }, 1000);

                  
                } else {
                    $("#dropdown-container").css({'visibility': 'visible'});
                    $("#dropdown-container").stop().animate({'top' : '0px'}, 500, function () {
                        
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

        }
    };

    return Dropdown;

})();

var Listview = (function() {

    var Listview = function(element, data) {
        this.element = element;
        this.active;
        this.data = data;
        var that = this;
        console.log(this.data);

        element.on('click', 'li header', function(event) {
            that.open($(this).parent());
            return false;
        });

        if (this.data.results[0].available !== undefined) {
            this.showAvailability();
        } else if (this.data.results[0].isOpen !== undefined) {
            this.showOpen();
        }

    };

    Listview.prototype.showOpen = function() {
        for(var i = 0; i < this.data.results.length; i++) {
            if(this.data.results[i].isOpen == true) {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation-alternate');
                $("article header h1 span:eq(" + i + ")").html('open');
            } else {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation');
                $("article header h1 span:eq(" + i + ")").html('gesloten');
            }
        }
    };


    Listview.prototype.showAvailability = function () {
        for(var i = 0; i < this.data.results.length; i++) {
            if(this.data.results[i].available == 0) {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation-alternate');
                $("article header h1 span:eq(" + i + ")").html('volzet');
            } else if(this.data.results[i].available == 1) {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation');
                $("article header h1 span:eq(" + i + ")").html('1 kamer');
            } else {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation');
                $("article header h1 span:eq(" + i + ")").html(this.data.results[i].available + ' kamers');
            }
        }
    }

    Listview.prototype.open = function(element) {
        if(this.active != null) {
            this.active.find('.detail-view').slideUp(500);
        }

        if(element.hasClass('is-active')) {
            $('.is-active').removeClass('is-active');
            return false;
        }

        $('.is-active').removeClass('is-active');

        this.active = element;
        this.active.addClass('is-active');
        element.find('.detail-view').slideDown(700);
    };

    return Listview;

}());

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
        //this.api = 'http://192.168.2.9/Devine/_MAMP_JAAR2/_SEM2/MAIV/rolstende/api/'
        //this.api = 'http://192.168.2.8/maiv_oostende/api/';
        this.api = 'http://192.168.2.4/rolstende/api/';
    };

    return Settings;

})();

var Validate = (function () {

    var Validate = function () {

        console.log("init validate");

        var that = this;
        this.settings = new Settings();

        $('#contactform #name, #subscribeform #name').blur(function () {
            that.checkTwoCharacters($(this).val(), $(this));
        });
        $('#contactform #name, #subscribeform #name').keyup(function () {
            that.checkTwoCharacters($(this).val(), $(this));
        });


        $('#contactform #message').blur(function(){
            that.checkTwoWords($(this).val(), $(this));
        });
        $('#contactform #message').keyup(function(){
            that.checkTwoWords($(this).val(), $(this));
        });


        $('#contactform #email, #subscribeform #email').blur(function(){
            that.checkValidEmail($(this).val(), $(this));
        });
        $('#contactform #email, #subscribeform #email').keyup(function(){
            that.checkValidEmail($(this).val(), $(this));
        });

        $('#contactform, #subscribeform').submit(function(){
            that.submitForm($(this), $(this).attr("id"));

            return false;
        });
        
    };

    Validate.prototype.checkTwoCharacters = function (value, element) {
        console.log("2 charachters checken");
        console.log(this);
       if (value.length < 2) {
           this.showInValid(element);
           return false;
       } else {
           this.showValid(element);
           return true;
       }

    };

    Validate.prototype.showInValid = function(element){
        element.addClass('error');
    };

    Validate.prototype.showValid = function(element){
        element.removeClass('error');
    };

    Validate.prototype.checkValidEmail = function(value, element){
       var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);

    console.log("hallo");

       if(pattern.test(value))
       {
           console.log("yes");
           this.showValid(element);
           return true;
       }
       if(!pattern.test(value))
       {
           console.log("no");
           this.showInValid(element);
           return false;
       }

    }


    Validate.prototype.checkTwoWords = function(value, element){
    //console.log('de value die binnen komt is ' + $.trim(value.split(' ')));
    var words = $.trim(value);
    var wordsArray = words.split(' ');
    console.log(wordsArray.length);
    var valid = true;

     if((wordsArray.length)>= 2){
            $.each(wordsArray, function (key, value){
                     if (key < 2){ // enkel eerste twee woorden
                         if(value.length < 1){ // is het woord meer dan 1 karakter?
                             valid = false;
                         }
                     }else{
                         return false;
                     }
            });
        }
        else {
            valid = false; 
        }

    if (valid){
        this.showValid(element);

    }else {
        this.showInValid(element);
    }




    }


    Validate.prototype.submitForm = function(element, id){
        element.find('input, textarea').blur();

        if (element.find('.error').length >0){
            return false;
        }else{
          console.log(id);

            console.log(this.settings["api"]);


           if (id === "subscribeform"){
                console.log("ingeschreven");
                
                $.ajax({
                  type:'POST',
                  cache: false,
                  url: this.settings.api + 'subscribers',
                  data: {'name': $("#name").val(), 'email': $("#email").val()},
                  success: function(data) {
                    console.log('gelukt');
                    console.log(data);
                    if(data == "Could not insert data into rolstende_subscribers") {
                      $(element).fadeOut(300).html('<h2>Inschrijven voor nieuwsbrief</h2><div class="succes">Je was al ingeschreven voor de nieuwsbrief.</div>')
                      $(element).delay(300).fadeIn(300);
                    } else {
                      $(element).fadeOut(300).html('<h2>Inschrijven voor nieuwsbrief</h2><div class="succes">Je bent succesvol ingeschreven voor de nieuwsbrief.</div>')
                      $(element).delay(300).fadeIn(300);
                    }
                  },
                  error: function (data) {
                    console.log('niet gelukt');
                    console.log(data);
                  }
                });
                

                return false;
            }else if (id === "contactform"){
               console.log("mailtje gestuurd");
               console.log("ingeschreven");
                $(element).fadeOut(300).html('<h2>Contacteer ons</h2><div class="succes">Je boodschap is succesvol verstuurd.</div>')
                $(element).delay(300).fadeIn(300);
                return false;
            }

            return true;
        }

    }

    return Validate;
})();

(function () {

    if (!!('ontouchstart' in window)) {
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

})();