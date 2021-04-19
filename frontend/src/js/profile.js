import config from '../config/config.json'
import { createAuthWindow, createFooter, createHeader, userLogged } from './templates/main.tmpl';
import { createProfileTabs, createProfile, createStatistics, createChart, createSitesRows, userSiteDeleteConfirm } from './templates/profile.tmpl';
import { checkAuth, profileGet, profileSave, siteStats, siteGet, siteDel } from './lib/clientRequests';
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
    $('.ya-share2').each(function(data) {
      Ya.share2(this,  {
        content: {
          url: $(this).data('url')
        }        
      });
    });
  }).done(function() {   
    $('#sites-table td > a').each(function(data) {
      $(this).on('click', function() {        
        const id = $(this).data('sid');        
        siteGet({sid: id}).done(function(data) {
          const site = JSON.parse(data.data);          
          $('#delete-site-body').attr('data-sid', site.id);          
          $('#delete-site-body').text('Вы действительно желаете удалить сайт ' + site.site_url);          
        });
      });
    });
  });
  
  profileGet().done(function(data) {
    const parsed = JSON.parse(data.data);
    $('#profile-fio').val(parsed.fullname);
    $('#profile-email').val(parsed.email);
    $('#profile-number').val(parsed.phone);    
  });

  $('#delete-site').on('click', function() {
    const id = $('#delete-site-body').data('sid');
    siteDel({sid: id}).done(function() {      
      $('#delete-site-confirm').hide();
      const alertMsg = `
      <div class="alert alert-success" role="alert">
        Сайт успешно удален
      </div>
      `;
      $('#stat-con').prepend(alertMsg);
      setTimeout(() => {        
        window.location.reload();
        // window.location.replace('/pages/profile.html#statistics-tab');
      }, 1500); 
    });
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
    profileSave(formFields).done(function(data) {      
      const alertMsg = `
      <div class="alert alert-success" role="alert">
        Учетные данные обновлены.
      </div>
      `;
      $('#profile-edit-form').prepend(alertMsg);
      setTimeout(() => {
        window.location.reload()
      }, 1500);      
    });     
  });
}).fail(function(data) {
  
});


