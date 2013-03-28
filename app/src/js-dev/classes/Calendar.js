var Calendar = (function () {

    var Calendar = function (element) {
        this.element = element;
        this.heading = element.find('.calendar-heading h2');
        this.table = element.find('.calendar-table');
        this.today = new Date();
        this.counter = new Date();
        this.settings = new Settings();

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
        console.log(this.settings.api + 'events/for/' + this.counter.getFullYear() + '/' + (this.counter.getMonth() + 1));
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
                cells.eq(index).html('<a href="#event-' + value.id + '">' + (i + 1) + '</a>');
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