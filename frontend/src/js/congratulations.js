import config from '../config/config.json';
import { voteEmailConfirm } from './lib/clientRequests';
import '../styles/style.scss';
document.title = config.confirm.title;

const container = () => `
<div class="position-absolute top-50 start-50 translate-middle d-flex justify-content-center">
  <div class="alert alert-primary" role="alert">
    Страница подтверждения голоса.
  </div>
</div>`;

$(document.body).append(container);

$(function() {
  const hash = window.location.search.split('=')[1]; 
  if(hash) {
    voteEmailConfirm({confirm_hash: hash}).done(function(data) {    
      if(data.token) {
        setTimeout(() => {
          $('.alert').removeClass('alert-primary');
          $('.alert').addClass('alert-success');
          $('.alert').text('Спасибо за ваш голос. Переход на главную страницу.');        
          setTimeout(() => window.location.replace('/'), 1000);
        }, 2000);
      } else {
        setTimeout(() => {
          $('.alert').removeClass('alert-primary');
          $('.alert').addClass('alert-warning');
          $('.alert').text('Ваш голос уже учтен. Переход на главную страницу.');
          setTimeout(() => window.location.replace('/'), 5000);
        }, 2000);
      }        
    }).fail(function() {
      setTimeout(() => {
        $('.alert').removeClass('alert-primary');
        $('.alert').addClass('alert-danger');
        $('.alert').text('Ошибка выполнения запроса. Переход на главную ...');
        setTimeout(() => window.location.replace('/'), 5000);
      }, 2000);
    });
  } else {
    window.location.replace('/');
  }  
});


