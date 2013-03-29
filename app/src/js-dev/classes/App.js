var App = (function () {

    var App = function () {
        this.sv = new SlidingView('sidebar', 'app');

        this.setupLocalStorage();

        this.showMap = false;

        this.loadIndex();

        this.loadSidebar();
        this.initNavigation();
    };

    App.prototype.setupLocalStorage = function () {
        if (localStorage['wcs_updated'] === undefined) {
            localStorage['wcs_updated'] = new Date(400).getTime();
        }

        if (localStorage['wcs'] === undefined) {
            localStorage['wcs'] = '{"results":[]}';
        }

        if (localStorage['restaurants_updated'] === undefined) {
            localStorage['restaurants_updated'] = new Date(400).getTime();
        }

        if (localStorage['restaurants'] === undefined) {
            localStorage['restaurants'] = '{"results":[]}';
        }

        if (localStorage['hotels_updated'] === undefined) {
            localStorage['hotels_updated'] = new Date(400).getTime();
        }
        if (localStorage['hotels'] === undefined) {
            localStorage['hotels'] = '{"results":[]}';
        }

        if (localStorage['pointsofinterest_updated'] === undefined) {
            localStorage['pointsofinterest_updated'] = new Date(400).getTime();
        }

        if (localStorage['pointsofinterest'] === undefined) {
            localStorage['pointsofinterest'] = '{"results":[]}';
        }
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
        //     that.sv.close();
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
                    $("#anim-container").html(html);
                    that.loadCalendar();
                    break;

                case '#spots':
                    if (that.showMap === true) {
                        template = $('#mapTemplate').html();
                        html = Mustache.to_html(template, {switchClass: 'active', statusLocatie: 'hide'}, partials);
                        $("#anim-container").html(html);
                        that.loadMap();
                    } else {
                        that.loadIndex();
                    }
                    break;

                case '#info':
                    template = $('#infoTemplate').html();
                    html = Mustache.to_html(template, {switchClass: 'hide'}, partials);
                    $("#anim-container").html(html);
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
                settings = new Settings(),
                now = new Date().getTime(),
                bodyClass,
                localStorageName,
                apiPath;

            switch ($(this).attr('href')) {
                case '#list-wcs':
                    bodyClass = 'blue-wood';
                    info.headingClass = 'heading-wcs';
                    info.color = 'blue';
                    info.statusLocatie = 'hide';
                    info.showPhotos = false;
                    localStorageName = 'wcs';
                    apiPath = 'wcs';
                    break;

                case '#list-poi':
                    bodyClass = 'orange-wood';
                    info.headingClass = 'heading-bezienswaardigheden';
                    info.statusLocatie = 'hide';
                    info.color = 'orange';
                    info.showPhotos = true;
                    localStorageName = 'pointsofinterest';
                    apiPath = 'pointsofinterest';
                    break;

                case '#list-restaurants':
                    bodyClass = 'blue-wood';
                    info.headingClass = 'heading-restaurants';
                    info.statusLocatie = 'list-view-annotation';
                    info.color = 'blue';
                    info.showPhotos = true;
                    localStorageName = 'restaurants';
                    apiPath = 'restaurants';
                    break;

                case '#list-hotels':
                    bodyClass = 'red-wood';
                    info.headingClass = 'heading-hotels';
                    info.statusLocatie = 'list-view-annotation';
                    info.color = 'red';
                    info.showPhotos = true;
                    localStorageName = 'hotels';
                    apiPath = 'hotels';
                    break;
            }

            $('body').addClass(bodyClass);

            if (parseInt(localStorage[localStorageName + '_updated'], 10) < (now - 3600)) {
                $.ajax({
                    type: 'get',
                    url: settings.api + apiPath,
                    success: function(data) {
                        localStorage[localStorageName] = JSON.stringify(data);
                        localStorage[localStorageName + '_updated'] = new Date().getTime();
                        info.results = data.results;
                        html = Mustache.to_html(template, info, partials);
                        $('#anim-container').html(html);
                        that.listView(data);
                        $("#ajax-loader").html('');
                    },
                    error: function () {
                        var data = JSON.parse(localStorage[localStorageName]);
                        info.results = data.results;
                        html = Mustache.to_html(template, info, partials);
                        $('#anim-container').html(html);
                        that.listView(data);
                        $("#ajax-loader").html('');
                    }
                });
            } else {
                var data = JSON.parse(localStorage[localStorageName]);
                info.results = data.results;
                html = Mustache.to_html(template, info, partials);
                $('#anim-container').html(html);
                that.listView(data);
                $("#ajax-loader").html('');
            }

            html = Mustache.to_html(template, info, partials);
            $("#anim-container").html(html);
            $('#app').click();
            return false;
        });

        $('#app').on('click', '.back-button', function () {
            $("#ajax-loader").html('');
            console.log('test');
            var template = $('#indexTemplate').html();
            var html = Mustache.to_html(template, {switchClass: ''}, {header: $('#headerTemplate').html()});
            $("#anim-container").html(html);

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
                $("#anim-container").html(html);
                that.loadMap();
            }
        });

    };

    App.prototype.loadIndex = function() {
        this.showMap = false;
        var template = $('#indexTemplate').html();
        var html = Mustache.to_html(template, {switchClass: ''}, {header: $('#headerTemplate').html()});
        $("#anim-container").html(html);
    };

    return App;

})();