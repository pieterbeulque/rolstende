var Validate = (function () {

    var Validate = function () {

        console.log("init validate");

        var that = this;

        $('#contactform #name').blur(function () {
            that.checkTwoCharacters($(this).val(), $(this));
        });
        $('#contactform #name').keyup(function () {
            that.checkTwoCharacters($(this).val(), $(this));
        });


        $('#contactform #message').blur(function(){
            that.checkTwoWords($(this).val(), $(this));
        });
        $('#contactform #message').keyup(function(){
            that.checkTwoWords($(this).val(), $(this));
        });


        $('#contactform #email').blur(function(){
            that.checkValidEmail($(this).val(), $(this));
        });
        $('#contactform #email').keyup(function(){
            that.checkValidEmail($(this).val(), $(this));
        });

        $('#contactform').submit(function(){
            that.submitForm($(this));
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


    Validate.prototype.submitForm = function(element){
        element.find('input, textarea').blur();

        if (element.find('.error').length >0){
            return false;
        }else{
            return true;
        }

    }

    return Validate;
})();