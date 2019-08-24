//$(function() {
  // Post Toggle View
  $('#post-comment').hide();
  $('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
  });
  
  // Like Button Request
  $('#btn-like').click(function(e) {
    e.preventDefault();
    let publishId = $(this).data('id');
    console.log(publishId);
    $.post('/like/' + publishId)
      .done(data => {
      console.log(data);
        $('.likes-count').text(data.likes);
    });
  });

  // Delete Button Request
  $('#btn-delete').click(function (e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Estas seguro de querer eliminar esta publicacion?');
    if (response) {
      let publishId = $(this).data('id');
     $.ajax({
        url: '/publicacion/' + publishId,
        type: 'POST'
      })
        .done(function(result) {
          $this.removeClass('btn-danger').addClass('btn-success');
          $this.find('i').removeClass('fa-times').addClass('fa-check');
	  location.reload();
        });
    }
  });
//});