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
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation');
                $("article header h1 span:eq(" + i + ")").html('open');
            } else {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation-alternate');
                $("article header h1 span:eq(" + i + ")").html('gesloten');
            }
        }
    };


    Listview.prototype.showAvailability = function () {
        for(var i = 0; i < this.data.results.length; i++) {
            if(this.data.results[i].available == 0) {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation');
                $("article header h1 span:eq(" + i + ")").html('volzet');
            } else if(this.data.results[i].available == 1) {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation-alternate');
                $("article header h1 span:eq(" + i + ")").html('1 kamer');
            } else {
                $("article header h1 span:eq(" + i + ")").addClass('list-view-annotation-alternate');
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