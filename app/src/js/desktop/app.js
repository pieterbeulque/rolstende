/**
 * Created with JetBrains PhpStorm.
 * User: tatsBookPro
 * Date: 29/03/13
 * Time: 10:38
 * To change this template use File | Settings | File Templates.
 */

$('document').ready(init);

function init(){

    $('body').backstretch("img/desktop/background.jpg");

    if ( $.fn.makisu.enabled ) {
            var open = false;


            var $maki = $( '.maki' ),
                $dt = $('.info-button, dd');

            $dt.click(function() {
                if(open) {
                    $maki.makisu('close');
                    open = false;
                    

                    setTimeout(function() {
                        $("#dropdown-container").stop().animate({'top' : '-60px'})
                    }, 1000);
            
                 
                } else {
               
                    $("#dropdown-container").css({'top': '-60px'}).stop().animate({'top' : '0px'}, 500, function(){
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
        
    



}
