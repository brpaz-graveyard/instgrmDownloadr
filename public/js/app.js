/**
    main application javascript file
    @author Bruno Paz <brunopaz@sapo.pt>
 */
 
var IGD = window.IGD || {};

IGD = {

	/**
	  * makes an user search
	  */
	userSearch: function(){

		form = $('#user-search-form');

		$.ajax( {
			url: form.attr('action'),
			type: "POST",
			data: form.serialize(),
			beforeSend: function(){
				$('#user-search-result').empty();
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
	},

	feed: {

		/**
		 * load more content
		 */
		showMore: function(obj){

	   		$.ajax( {

				url: obj.attr('href'),
				data: { 'next_max_id' : obj.data('next-max-id')},
				beforeSend: function(){
					$('#show-more').hide();
	        		$('#media-loader').show();
	    		}

			}).done(function(response) {
			  	$('.pager').remove();
			    $('#media-container').append(response);

			  }).fail(function() {
			     alert( "error" );

			  }).always(function(){
			  		$('#media-loader').hide();
			  });

	   	}	
			
	}

}


/**
 * DOM READY
 */ 
$(function(){

	/**
	  * avoids submit the form on enter
	  */
	$("#user-search-form").on("keypress", function (e) {
	    if (e.keyCode == 13) {
	    	e.preventDefault();

	       IGD.userSearch();
	    }


	});

	/**
	 * submits the user search form and renders the result
	 */
   $('#user-search-submit').on('click',function(){ 		
   		IGD.userSearch();
   });


   /**
    * users media pagination
    */
   $('#media-container').on('click','#show-more',function(e){
   		IGD.feed.showMore($(this));  
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
   		
   		e.preventDefault();
   		
   		$('form#media').submit();

   });

});