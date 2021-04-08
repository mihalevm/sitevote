import config from '../config/config.json'
import { createAuthWindow, createFooter, createHeader, userLogged } from './templates/main.tmpl';
import { createProfileTabs, createProfile, createStatistics, createChart } from './templates/profile.tmpl';
import { createSiteAwards } from './templates/index.tmpl';
import { checkAuth, loadProfile, updateProfile } from './lib/auth' 
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
  loadProfile().done(function(data) {
    const parsed = JSON.parse(data.data);
    $('#profile-fio').val(parsed.fullname);
    $('#profile-email').val(parsed.email);
    $('#profile-number').val(parsed.phone);    
  });
  $('#profile-edit-form').on('submit', function(e) {     
    let formFields = $(this).serializeArray();    
    formFields = formFields.reduce((obj, i) => {      
      obj[i.name] = i.value;
      return obj;
    }, {});
    // Email required field
    updateProfile(formFields).done(() => {
      const form = $('#profile-edit-form');
      const alertMessage = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      form.removeClass('was-validated');
      form.append(alertMessage);
    });    
  });
}).fail(function(data) {
  console.log('fail', data);
});


