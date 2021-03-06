import config from '../config/config.json'
import { createAuthWindow, createFooter, createHeader, userLogged, createHelp } from './templates/main.tmpl';
import { createProfileTabs, createProfile, createStatistics, createChart, createSitesRows, createSiteDeleteConfirm } from './templates/profile.tmpl';
import { checkAuth, profileGet, profileSave, siteStats, siteGet, siteDel } from './lib/clientRequests';
import { emailValidationEvent } from './lib/events' 
import { Modal } from 'bootstrap';
import '../styles/style.scss';

const container = () => `
<div id="profile-main" class="container">
</div>
`;

document.title = config.profile.page_title;
createHeader(document.body);
createAuthWindow(document.body);
createHelp(document.body);
$(document.body).append(container);
createFooter(document.body);
createProfileTabs('#profile-main');
createProfile('#profile-tab');
createStatistics('#statistics-tab');
createChart('#statistics-tab');
createSiteDeleteConfirm('#statistics-tab');

checkAuth().done(function() {
  userLogged();
  siteStats().done(function(data) {
    if(data.error === 200) {
      const sites = JSON.parse(data.data);    
      const tableRows = createSitesRows(sites);      
      $('#sites-table tbody').append(tableRows);  
      // Reflow warning
      $.each(sites, function(i,v) {
        const div = $(`div[data-item-id=${v.id}]`)[0];      
        Ya.share2(div,  {
          content: {
            url: $(div).data('url'),
          }
        });
      });    
    }    
  }).done(function() {   
    $('#sites-table td > a').each(function(data) {
      $(this).on('click', function() {        
        const id = $(this).data('sid');        
        siteGet({sid: id}).done(function(data) {
          const site = JSON.parse(data.data);          
          $('#delete-site-body').attr('data-sid', site.id);          
          $('#delete-site-body').text(config.alertsMessages.site_del + site.site_url);          
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
    siteDel({sid: id}).done(function(data) {
      if(data.data) {        
        const deleteModalEl = document.getElementById('delete-site-confirm');
        const deleteModal = Modal.getInstance(deleteModalEl);
        deleteModal.hide();
        const siteId = $('#delete-site-body').attr('data-sid');      
        $(`tr[data-sid=${siteId}]`).remove();
        const alertMsg = `
        <div id="delete-alert" class="alert alert-success" role="alert">
          ${config.alertsMessages.site_del_success}
        </div>
        `;
      $('#stat-con').prepend(alertMsg);
      setTimeout(() => {        
        $('#delete-alert').remove();
      }, 1500); 
      } else {
        console.log(config.alertsMessages.requests.send_err);
      }      
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
        ${config.alertsMessages.profile_update_success}
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


