$(document).ready(function() {
	$(registerForm).hide();
	$(".loginRegisterSwitch").click(function(event) {
		$(".loginRegisterSwitch, .loginRegisterForm").toggle();
	});
});	