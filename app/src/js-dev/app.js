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