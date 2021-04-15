import config from '../config/config.json';
import { accountConfirm } from './lib/clientRequests';
import '../styles/style.scss';
document.title = config.confirm.title;

const container = () => `
<div class="position-absolute top-50 start-50 translate-middle d-flex justify-content-center">
  <div class="alert alert-primary" role="alert">
    Страница подтверждения регистрации.
  </div>
</div>`;

$(document.body).append(container);

$(function() {    
  const hash = window.location.search.split('=')[1];  
  accountConfirm({confirm_hash: hash}).done(function(data) {    
    if(data.token) {
      setTimeout(() => {
        $('.alert').removeClass('alert-primary');
        $('.alert').addClass('alert-success');
        $('.alert').text('Аккаунт успешно подтвержден. Переход на страницу профиля.');        
        setTimeout(() => window.location.replace('/pages/profile.html'), 1000);
      }, 2000);
    } else {
      setTimeout(() => {
        $('.alert').removeClass('alert-primary');
        $('.alert').addClass('alert-warning');
        $('.alert').text('Ошибка подтверждения аккаунта. Возможно вы уже зарегистрированы, попробуйте авторизоваться.');
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
});


