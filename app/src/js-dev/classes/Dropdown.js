var Dropdown = (function () {

    var Dropdown = function () {
      if ( $.fn.makisu.enabled ) {
            var open = false;


            var $maki = $( '.maki' ),
                $dt = $('.info-button, dd');

            $dt.click(function() {
                if(open) {
                    $maki.makisu('close');
                    open = false;
                    setTimeout(function() {
                        $("#dropdown-container").css({'top': '0px'}).delay(500).stop().animate({'top' : '-60px'}, function() {
                            $("#dropdown-container").css({'display': 'none'});
                        });
                    }, 1000);
            
                 
                } else {
               
                	$("#dropdown-container").css({'display': 'block', 'top': '-60px'}).stop().animate({'top' : '0px'}, 500, function(){
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

            // Open all
            

            // Toggle on click

            $( '.toggle' ).on( 'click', function() {
                $( '.list' ).makisu( 'toggle' );
            });

            // Disable all links

            $( '.demo a' ).click( function( event ) {
                event.preventDefault();
            });

        } else {
            $( '.warning' ).show();
        }
        
    };


 // The `enabled` flag will be `false` if CSS 3D isn't available



    return Dropdown;
})();