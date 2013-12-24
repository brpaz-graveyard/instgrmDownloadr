/**
    main application javascript file
    @author Bruno Paz <brunopaz@sapo.pt>
 */
 
 var IGD = window.IGD || {};
 
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
   $('#media-container').on('click','#more-media',function(e){

   		var that = $(this);
   		var jqxhr = $.ajax( {
			url: that.attr('href'),
			data: { 'next_max_id' : that.data('next-max-id')},
			beforeSend: function(){
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



});