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