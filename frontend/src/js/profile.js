import config from '../config/config.json'
import { createAuthWindow, createFooter, createHeader, userLogged } from './templates/main.tmpl';
import { createProfileTabs, createProfile, createStatistics, createChart, createSitesRows, userSiteDeleteConfirm } from './templates/profile.tmpl';
import { checkAuth, loadProfile, updateProfile, siteStats } from './lib/clientRequests';
import { emailValidationEvent } from './lib/events' 
import '../styles/style.scss';

const container = () => `
<div id="profile-main" class="container">
</div>
`;

document.title = config.profile.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createFooter(document.body);
createProfileTabs('#profile-main');
createProfile('#profile-tab');
createStatistics('#statistics-tab');
createChart('#statistics-tab');
userSiteDeleteConfirm('#statistics-tab');

checkAuth().done(function() {
  userLogged();
  siteStats().done(function(data) {
    const sites = JSON.parse(data.data);    
    const tableRows = createSitesRows(sites);      
    $('#sites-table tbody').append(tableRows);
  });
  
  loadProfile().done(function(data) {
    const parsed = JSON.parse(data.data);
    $('#profile-fio').val(parsed.fullname);
    $('#profile-email').val(parsed.email);
    $('#profile-number').val(parsed.phone);    
  });

  $('#profile-email').on('keyup', function() {
    emailValidationEvent(this, '#profile-save', '#profile-e-inv');
  });
  $('#profile-edit-form').on('submit', function(e) {
    e.preventDefault();

    let formFields = $(this).serializeArray();    
    formFields = formFields.reduce((obj, i) => {      
      obj[i.name] = i.value;
      return obj;
    }, {});    
    updateProfile(formFields).done(function(data) {      
      const alertMsg = `
      <div class="alert alert-success" role="alert">
        Учетные данные обновлены.
      </div>
      `;
      $('#profile-edit-form').prepend(alertMsg);
      setTimeout(() => {
        window.location.reload()
      }, 1000);      
    });     
  });
}).fail(function(data) {
  
});


