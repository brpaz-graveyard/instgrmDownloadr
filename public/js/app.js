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

});