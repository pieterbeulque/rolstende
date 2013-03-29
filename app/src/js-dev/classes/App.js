var App = (function () {

    var App = function () {
        this.sv = new SlidingView('sidebar', 'app');

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
                    template = $('#mapTemplate').html();
                    html = Mustache.to_html(template, {switchClass: 'active'}, partials);
                    $('#app').html(html);
                    that.loadMap();
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
        var template = $('#indexTemplate').html();
        var html = Mustache.to_html(template, {switchClass: ''}, {header: $('#headerTemplate').html()});
        $('#app').html(html);
    };

    return App;

})();