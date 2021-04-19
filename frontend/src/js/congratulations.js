import config from '../config/config.json';
import { voteEmailConfirm } from './lib/clientRequests';
import { changeMainBlock } from './lib/events';
import '../styles/style.scss';
document.title = config.confirm.title;

const container = () => `
<div class="position-absolute top-50 start-50 translate-middle d-flex justify-content-center">
  <div class="alert alert-primary" role="alert">
    ${config.congratulations.main}
  </div>
</div>`;

$(document.body).append(container);
$(function() {
  const hash = window.location.search.split('=')[1]; 
  if(hash) {
    voteEmailConfirm({confirm_hash: hash}).done(function(data) { 
      if(data.data) {
        changeMainBlock('alert-primary', 'alert-success', config.congratulations.alerts.success, '/', 3000);          
      } else {
        changeMainBlock('alert-primary', 'alert-warning', config.congratulations.alerts.warning, '/', 3000);
      }        
    }).fail(function() {
      changeMainBlock('alert-primary', 'alert-danger', config.congratulations.alerts.error, '/', 5000);        
    });
  } else {
    window.location.replace('/');
  }  
});


