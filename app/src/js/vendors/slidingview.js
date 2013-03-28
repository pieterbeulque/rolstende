// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

var SlidingView = function (sidebarID, bodyID) {
    window.slidingView = this;

    $(".sidebar ul li").each(function () {
        $(this).css({'height': '34%'});
        $(this).css('height', $(this).height());
    });

    this.gestureStarted = false;
    this.bodyOffset = 0;

    this.sidebarWidth = 90;

    this.sidebar = $('#' + sidebarID);
    this.body = $('#' + bodyID);

    this.sidebar.addClass('slidingview_sidebar');
    this.body.addClass('slidingview_body');

    var self = this;

    $(window).on('resize', function (event) {
        self.resizeContent();
    });

    $(this.parent).on('resize', function (event) {
        self.resizeContent();
    });

    if ('onorientationchange' in window) {
        $(window).on('onorientationchange', function (event) {
            self.resizeContent();
        });
    }

    this.resizeContent();
    this.setupEventHandlers();
};

SlidingView.prototype.setupEventHandlers = function () {
    this.touchSupported = ('ontouchstart' in window);

    this.START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
    this.MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
    this.END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';

    var self = this;
    this.touchStartHandler = function (event) {
        self.onTouchStart(event);
    };

    this.body.get()[0].addEventListener(this.START_EVENT, this.touchStartHandler, false);
};

SlidingView.prototype.onTouchStart = function (event) {
    this.gestureStartPosition = this.getTouchCoordinates(event);

    var self = this;
    this.touchMoveHandler = function (event) {
        self.onTouchMove(event);
    };

    this.touchUpHandler = function (event) {
        self.onTouchEnd(event);
    };

    this.body.get()[0].addEventListener(this.MOVE_EVENT, this.touchMoveHandler, false);
    this.body.get()[0].addEventListener(this.END_EVENT, this.touchUpHandler, false);
    this.body.stop();
};

SlidingView.prototype.onTouchMove = function (event) {

    // Block sidebar when in map view
    // TO DO
    if ($(event.target).closest('#map_canvas').length > 0) {
        event.preventDefault();
        event.stopPropagation();
        this.unbindEvents();
        return false;
    }

    var currentPosition = this.getTouchCoordinates(event);

    if (this.gestureStarted) {
        event.preventDefault();
        event.stopPropagation();
        this.updateBasedOnTouchPoints(currentPosition);
        return;
    } else {
        if (Math.abs(currentPosition.y - this.gestureStartPosition.y) > 50) {
            this.unbindEvents();
            return;
        } else if (Math.abs(currentPosition.x - this.gestureStartPosition.x) > 50) {
            this.gestureStarted = true;
            event.preventDefault();
            event.stopPropagation();
            this.updateBasedOnTouchPoints(currentPosition);
            return;
        }
    }
};

SlidingView.prototype.onTouchEnd = function (event) {
    if (this.gestureStarted) {
        this.snapToPosition();
    }

    this.gestureStarted = false;
    this.unbindEvents();
};

SlidingView.prototype.updateBasedOnTouchPoints = function (currentPosition) {
    var deltaX = (currentPosition.x - this.gestureStartPosition.x),
        targetX = Math.min(Math.max(this.bodyOffset + deltaX, 0), this.sidebarWidth);

    this.bodyOffset = targetX;

    if (this.body.css("left") != "0px") {
        this.body.css("left", "0px" );
    }

    this.body.css('-webkit-transform', 'translate3d(' + targetX + 'px,0,0)');
    this.body.css('transform', 'translate3d(' + targetX + 'px,0,0)');

    this.sidebar.trigger('slidingViewProgress', {current: targetX, max:this.sidebarWidth});

    this.gestureStartPosition = currentPosition;
};

SlidingView.prototype.snapToPosition = function () {
    var currentPosition = this.bodyOffset,
        halfWidth = this.sidebarWidth / 2,
        targetX;

    this.body.css('left', '0px');

    targetX = (currentPosition < halfWidth) ? 0 : this.sidebarWidth;

    this.bodyOffset = targetX;

    if (currentPosition != targetX) {
        this.slideView(targetX);
    }
};

SlidingView.prototype.slideView = function (targetX) {
    this.body.stop(true, false).animate({
        left: targetX,
        avoidTransforms: false,
        useTranslate3d: true
    }, 300);

    this.sidebar.trigger('slidingViewProgress', {current: targetX, max: this.sidebarWidth});
};

SlidingView.prototype.close = function () {
    this.bodyOffset = 0;
    this.slideView(0);
};

SlidingView.prototype.open = function () {
    if(this.bodyOffset == this.sidebarWidth) return;
    this.bodyOffset = this.sidebarWidth;
    this.slideView(this.sidebarWidth);
};

SlidingView.prototype.unbindEvents = function () {
    this.body.get()[0].removeEventListener(this.MOVE_EVENT, this.touchMoveHandler, false);
    this.body.get()[0].removeEventListener(this.END_EVENT, this.touchUpHandler, false);
};

SlidingView.prototype.getTouchCoordinates = function (event) {
    if (this.touchSupported) {
        var touchEvent = event.touches[0];
        return {x: touchEvent.pageX, y: touchEvent.pageY};
    } else {
        return {x: event.screenX, y: event.screenY};
    }
};

SlidingView.prototype.resizeContent = function () {
    this.body.width($(window).width());

    // Set every sidebar item to 33% height
    $('.sidebar ul li').each(function () {
        $(this).css({'height': '34%'});
        $(this).css('height', $(this).height());
    });
};