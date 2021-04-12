import config from '../config/config.json'
import { createAuthWindow, createFooter, createHeader, userLogged } from './templates/main.tmpl';
import { createProfileTabs, createProfile, createStatistics, createChart, createUserSites } from './templates/profile.tmpl';
import { createSiteAwards } from './templates/index.tmpl';
import { checkAuth, loadProfile, updateProfile } from './lib/clientRequests';
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
createSiteAwards('#statistics-tab');
createChart('#statistics-tab');

checkAuth().done(function(data) {
  userLogged();
  createUserSites('#sites-table tbody');
  
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
    updateProfile(formFields);     
  });
}).fail(function(data) {
  console.log('fail', data);
});


