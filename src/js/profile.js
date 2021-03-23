import '../styles/style.scss';
$('#auth-enter').click(function(){
  $('#auth-modal').show();
  $('#auth-modal-close-1').click(function() {
    $('#auth-modal').hide();
  });
  $('#auth-modal-close-2').click(function() {
    $('#auth-modal').hide();
  });
});
