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
    };

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