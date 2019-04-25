<?php

      $sendto   = "kostikovmu@ya.ru"; // почта, на которую будет приходить письмо
      $username = $_POST['name'];
      $userphone = $_POST['phone'];
      $formfrom = $_POST['from'];


      // Формирование заголовка письма
      $subject  = "Сообщение с сайта";
      $headers = 'From: "Хорошие админы 1с" <good-adms@ya.ru>\r\n';
      $headers .= "MIME-Version: 1.0\r\n";
      $headers .= "Content-Type: text/html;charset=utf-8 \r\n";

      // Формирование тела письма
      $msg  = "<html><body style='font-family:Arial,sans-serif;'>";
      $msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Сообщение с сайта</h2>\r\n";
      $msg .= "<p><strong>С сайта:</strong> ХорошиеАдмины.рф\1с</p>\r\n";
      $msg .= "<p><strong>Имя:</strong> " .$username."</p>\r\n";
      $msg .= "<p><strong>Телефон:</strong> " .$userphone."</p>\r\n";
      $msg .= "<p><strong>Откуда:</strong> " .$formfrom."</p>\r\n";

      $msg .= "</body></html>";

      // отправка сообщения
      if(@mail($sendto, $subject, $msg, $headers)) {
          echo 1;
      } else {
          echo 0;
      }

      ?>