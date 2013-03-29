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
                        $("#dropdown-container").css({'top': '0px'}).delay(500).stop().animate({'top' : '-60px'}, function() {
                            $("#dropdown-container").css({'display': 'none'});
                            $('.list').hide();
                        });
                    }, 1000);
                } else {
                    $('.list').hide();
                    $('#dropdown-container').show();

                    $("#dropdown-container").stop().animate({'top' : '0px'}, 500, function () {
                        $('.list').show();
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