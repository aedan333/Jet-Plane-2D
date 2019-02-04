$(function(){
	

	//THE LOGIN PAGE
	var username = "I764CYJX732";
	var password = "Jip";

	$('.js--login').click(function(){
		if($('.js--username').val() === username && $('.js--password').val()=== password){
			window.location.href = "1and7.html"; 
		}
		else{
			$('.js--login-error').addClass('s-visible');
		}
	});

	
});


