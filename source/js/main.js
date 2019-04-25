$(function () {
  svg4everybody();

  $('.form').submit(function(e){
    e.preventDefault();
    $.ajax({
      url: 'php/send.php',
      type: 'post',
      data: $(this).serialize(),
      beforeSend: function(){
        $('.msg').html('Отправляю...').animate({'color':'#000'}, 300);
      },
      success: function(response){
        if (response==0){
          $('.msg').html('Заполните поля!').animate({'color':'red'}, 300);
          setTimeout(function(){
            $('.msg').animate({'color':'transparent'}, 300, function(){$('.msg').html('&nbsp;')});
          }, 2000);
        } else if (response==1){
          $('.msg').html('Спасибо! Ваше сообщение получено.').animate({'color':'green'}, 300);
          setTimeout(function(){
            $('.shadow').fadeOut(300);
            $('.popup-call').animate({'margin-top':'+=50px', 'opacity':'0'}, 300);
            $('.popup-call').animate({'margin-top':'-=100px', 'opacity':'0'}, 0).fadeOut();
            $('.msg').animate({'color':'transparent'}, 300, function(){$('.msg').html('&nbsp;')});
            $('form input[type="text"]').val('');
          }, 3000);
        } else {
          $('.msg').html(response);
        }
      },
      error: function(){
        $('.msg').html('Ошибка! Попробуйте еще раз!').animate({'color':'#ff1a29'}, 300);
        setTimeout(function () {
          $('.msg').html('&nbsp;');
        }, 5000)
      }
    });
  });
});