var Validate = (function () {

    var Validate = function () {

        console.log("init validate");

        var that = this;
        this.settings = new Settings();

        $('#contactform #name, #subscribeform #name').blur(function () {
            that.checkTwoCharacters($(this).val(), $(this));
        });
        $('#contactform #name, #subscribeform #name').keyup(function () {
            that.checkTwoCharacters($(this).val(), $(this));
        });


        $('#contactform #message').blur(function(){
            that.checkTwoWords($(this).val(), $(this));
        });
        $('#contactform #message').keyup(function(){
            that.checkTwoWords($(this).val(), $(this));
        });


        $('#contactform #email, #subscribeform #email').blur(function(){
            that.checkValidEmail($(this).val(), $(this));
        });
        $('#contactform #email, #subscribeform #email').keyup(function(){
            that.checkValidEmail($(this).val(), $(this));
        });

        $('#contactform, #subscribeform').submit(function(){
            that.submitForm($(this), $(this).attr("id"));

            return false;
        });
        
    };

    Validate.prototype.checkTwoCharacters = function (value, element) {
        console.log("2 charachters checken");
        console.log(this);
       if (value.length < 2) {
           this.showInValid(element);
           return false;
       } else {
           this.showValid(element);
           return true;
       }

    };

    Validate.prototype.showInValid = function(element){
        element.addClass('error');
    };

    Validate.prototype.showValid = function(element){
        element.removeClass('error');
    };

    Validate.prototype.checkValidEmail = function(value, element){
       var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);

    console.log("hallo");

       if(pattern.test(value))
       {
           console.log("yes");
           this.showValid(element);
           return true;
       }
       if(!pattern.test(value))
       {
           console.log("no");
           this.showInValid(element);
           return false;
       }

    }


    Validate.prototype.checkTwoWords = function(value, element){
    //console.log('de value die binnen komt is ' + $.trim(value.split(' ')));
    var words = $.trim(value);
    var wordsArray = words.split(' ');
    console.log(wordsArray.length);
    var valid = true;

     if((wordsArray.length)>= 2){
            $.each(wordsArray, function (key, value){
                     if (key < 2){ // enkel eerste twee woorden
                         if(value.length < 1){ // is het woord meer dan 1 karakter?
                             valid = false;
                         }
                     }else{
                         return false;
                     }
            });
        }
        else {
            valid = false; 
        }

    if (valid){
        this.showValid(element);

    }else {
        this.showInValid(element);
    }




    }


    Validate.prototype.submitForm = function(element, id){
        element.find('input, textarea').blur();

        if (element.find('.error').length >0){
            return false;
        }else{
          console.log(id);

            console.log(this.settings["api"]);


           if (id === "subscribeform"){
                console.log("ingeschreven");
                
                $.ajax({
                  type:'POST',
                  cache: false,
                  url: this.settings.api + 'subscribers',
                  data: {'name': $("#name").val(), 'email': $("#email").val()},
                  success: function(data) {
                    console.log('gelukt');
                    console.log(data);
                    if(data == "Could not insert data into rolstende_subscribers") {
                      $(element).fadeOut(300).html('<h2>Inschrijven voor nieuwsbrief</h2><div class="succes">Je was al ingeschreven voor de nieuwsbrief.</div>')
                      $(element).delay(300).fadeIn(300);
                    } else {
                      $(element).fadeOut(300).html('<h2>Inschrijven voor nieuwsbrief</h2><div class="succes">Je bent succesvol ingeschreven voor de nieuwsbrief.</div>')
                      $(element).delay(300).fadeIn(300);
                    }
                  },
                  error: function (data) {
                    console.log('niet gelukt');
                    console.log(data);
                  }
                });
                

                return false;
            }else if (id === "contactform"){
               console.log("mailtje gestuurd");
               console.log("ingeschreven");
                $(element).fadeOut(300).html('<h2>Contacteer ons</h2><div class="succes">Je boodschap is succesvol verstuurd.</div>')
                $(element).delay(300).fadeIn(300);
                return false;
            }

            return true;
        }

    }

    return Validate;
})();