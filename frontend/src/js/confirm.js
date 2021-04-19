import config from '../config/config.json';
import { accountConfirm } from './lib/clientRequests';
import { changeMainBlock } from './lib/events';
import '../styles/style.scss';
document.title = config.confirm.title;

const container = () => `
<div class="position-absolute top-50 start-50 translate-middle d-flex justify-content-center">
  <div class="alert alert-primary" role="alert">
    ${config.confirm.main}
  </div>
</div>`;

$(document.body).append(container);
$(function() {
  const hash = window.location.search.split('=')[1]; 
  if(hash) {
    accountConfirm({confirm_hash: hash}).done(function(data) {    
      if(data.token) {
        changeMainBlock('alert-primary', 'alert-success', config.confirm.alerts.success, '/pages/profile.html', 3000);        
      } else {
        changeMainBlock('alert-primary', 'alert-warning', config.confirm.alerts.warning, '/', 3000);
      }        
    }).fail(function() {
      changeMainBlock('alert-primary', 'alert-danger', config.confirm.alerts.error, '/', 5000);
    });
  } else {
    window.location.replace('/');
  }  
});


