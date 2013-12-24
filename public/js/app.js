/**
    main application javascript file
    @author Bruno Paz <brunopaz@sapo.pt>
 */
 
 var IGD = window.IGD || {};

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {
 
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = Base64._utf8_encode(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
        }
 
        return output;
    },
 
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (i < input.length) {
 
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = Base64._utf8_decode(output);
 
        return output;
 
    },
 
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    }
 
}

$(function(){

	/**
	  * avoids submit the form on enter
	  */
	$("#user-search-form").bind("keypress", function (e) {
	    if (e.keyCode == 13) {
	        return false;
	    }
	});

	/**
	 * submits the user search form and renders the result
	 */
   $('#user-search-submit').on('click',function(){
   		
   		var form = $(this).closest('form');
				
		var jqxhr = $.ajax( {
			url: form.attr('action'),
			type: "POST",
			data: form.serialize(),
			beforeSend: function(){
        		$('#user-search-loader').show();
    		}
		})
		  .done(function(response) {
		    $('#user-search-result').html(response);
		  })
		  .fail(function() {
		    alert( "error" );
		  }).always(function(){
		  	$('#user-search-loader').hide();
		  });
   });


   /**
    * users media pagination
    */
   $('#media-container').on('click','#show-more',function(e){

   		var that = $(this);
   		var jqxhr = $.ajax( {
			url: that.attr('href'),
			data: { 'next_max_id' : that.data('next-max-id')},
			beforeSend: function(){
				$('#show-more').hide();
        		$('#media-loader').show();
    		}
		})
		  .done(function(response) {
		  	$('.pager').remove();
		    $('#media-container').append(response);
		  })
		  .fail(function() {
		    alert( "error" );
		  }).always(function(){
		  	$('#media-loader').hide();
		  });

   		e.preventDefault();
   });

   /**
    * select all user media from feed for download.
    */
   $('#btn-select-all').on('click',function(e){
   		$('.media-select').prop('checked',true);
   		e.preventDefault();
   });


   /**
    * deselect all user media from feed for download.
    */
   $('#btn-deselect-all').on('click',function(e){
   		$('.media-select').prop('checked',false);
   		e.preventDefault();
   });

   /**
    * downloads all the selected media
    */
   $('#btn-download').on('click',function(e){
   		var selectedMedia = $('.media-select:checked');
   		var url = $(this).attr('href');
   		
   		var files = selectedMedia.serialize();
   		
   		window.location = url + '?' + files;

   		e.preventDefault();
   });



});