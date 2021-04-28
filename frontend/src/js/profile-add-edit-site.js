import config from '../config/config.json'
import { Modal } from 'bootstrap';
import { checkAuth, siteVerify, siteSave, siteStats, siteGet } from './lib/clientRequests';
import { createAuthWindow, createHeader, createFooter, createHelp, userLogged, loadingCardIntoPage, getSRC } from './templates/main.tmpl';
import { createAddSite } from './templates/profile-add-edit-site.tmpl';
import '../styles/style.scss';

const container = () => `
<div class="container">
<div class="row pt-3">
  <main>
    <div id="select-site-con" class="container pt-5">
      <div class="pb-5">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-site-modal">
          Добавить сайт
        </button>
      </div>  
      <div class="input-group input-group-lg">
        <span class="input-group-text">${config.add_site.search}</span>
        <input type="text" id="sites-cards-search" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      </div>
    </div>
    <div id="profile-sites-list" class="container pt-5 pb-5">
    </div>
  </main>
</div>
</div>
`;

document.title = config.add_site.page_title;
createHeader(document.body);
createAuthWindow(document.body);
createHelp(document.body);
$(document.body).append(container);
createAddSite('#select-site-con');
createFooter(document.body);

$('#sites-cards-search').on('keyup', function() {
  let value = $(this).val().toLowerCase();
  $('#profile-sites-list div.col').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > - 1);    
  })
});

checkAuth().done(function(data) {
  userLogged();  
  const loadDataToForm = (el) => {
    const id = $(el).data('sid');        
    siteGet({sid: id}).done(function(data) {
      const site = JSON.parse(data.data); 
      const htmlBlock = (id) => `<div><img src="${getSRC()}/img/banner_480x240.png"><a href="${getSRC()}/pages/vote.html?sid=${id}">${config.profile.data_desc}</a></div>`;      
      $('#add-site-form').attr('data-sid', site.id);                
      $('#add-site-url').val(site.site_url);
      $('#add-share-block').val(htmlBlock(site.id, site.img_link));
      $('#add-site-img').attr('src', `${getSRC()}/storage/${site.img_link}_small.png`);
      $('#add-site-description').val(site.site_desc)
      $('.modal-title').text(config.add_site.site_edit);
      $('#dummy-svg').hide();
    });
  }; 
  siteStats().done(function(data) {
    if(data.error === 200) {
      const sites = JSON.parse(data.data);
      loadingCardIntoPage(sites, '#profile-sites-list', 'add-site-modal', loadDataToForm);
    }
  }).done(function() {
    $('#profile-sites-list .card').each(function() {
      $(this).on('click', function() {        
        loadDataToForm(this);
      });
    });
  });
  
  
  const clearAddSiteValues = () => {    
    $('#add-site-form input').each(function() {
      $(this).val('');
    });
    $('#add-site-description').val('');
    $('#add-site-form').attr('data-sid', '0');
    $('#add-share-block').val('');
    $('.modal-title').text(config.add_site.header);
    $('#add-site-img').attr('src', '');
    $('#dummy-svg').show();
  };
  
  $('#add-site-close').on('click', function() {
    clearAddSiteValues();
  });

  $('#add-site-check').on('click', function(e) {
    e.preventDefault();    
    if($('#add-site-url').val().length !== 0) {
      const url = $('#add-site-url').val();
      const getImg = siteVerify({url: url});
  
      if(getImg.state() === 'pending') {
        $('#dummy-svg').hide();            
        const spinner = `
        <div id="loading-spinner" style="width:466px; height:326px;">    
        <div class="position-relative top-50 start-50 translate-middle d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        </div>
        `;        
        $('#img-con').prepend(spinner);
      }  
      getImg.done(function(data) {        
        if(data.error === 200) {
          let src = getSRC() + data.data.small;
          // console.log(src);
          $('#add-site-img').attr('src', src);        
          $('#add-site-img').attr('data-origin', data.data.origin);
        } else {          
          const alertMsg = `
          <div id="al-img" style="width:466px; height:326px;">    
          <div class="position-relative top-50 start-50 translate-middle d-flex justify-content-center">
            <div class="alert alert-danger" role="alert">
              ${config.validationMessages.url.url_format_err}
            </div>
          </div>
          </div>
          `;
          $('#img-con').prepend(alertMsg);
          setTimeout(() => {
            $('#al-img').remove();
            $('#dummy-svg').show();
          }, 2000)
        }        
        $('#loading-spinner').remove();        
      }).fail(function(data) {
        $('#loading-spinner').remove();
        const alertMsg = `
          <div class="alert alert-danger" role="alert">
            ${config.alertsMessages.requests.img_load_err}
          </div>
        `;
        $('#img-con').prepend(alertMsg);
      });
    } else {
      $('#add-site-url').addClass('is-invalid');
    }  
  });

  $('#add-site-save').on('click', function(e) {    
    if($('#add-site-url').val().length != 0) {      
      const id = parseInt($('#add-site-form').attr('data-sid'));
      const imgSRC = ($('#add-site-img').attr('src') !== '') ? $('#add-site-img').attr('src').split('/storage/')[1].split('_')[0] : $('#add-site-img').data('origin');
      const site = {
        // Refactoring
        sid: parseInt(id),
        site_desc: ($('#add-site-description').val().length !== 0) ? $('#add-site-description').val() : config.alertsMessages.desc_none,
        site_url: $('#add-site-url').val(),
        short_link: '',
        img_link: imgSRC
      };      
      // without reload
      // const modalEl = document.getElementById('add-site-modal');
      // const modal = Modal.getInstance(modalEl);            
      // console.log(site)
      // modal.hide();              
      // clearAddSiteValues();
      if($('#add-site-img').attr('src') !== '') {        
        siteSave(site).done(function(data) {
          if(data.error === 200) {
            $('#add-site-modal').hide();
            window.location.reload();            
          } else {            
            console.log(data.data, data, site);            
          }
        }).fail(function(data) {
          console.log(data.error);
        });
      } else {
        $('#dummy-svg').hide();
        const alertMsg = `
        <div id="al-img" style="width:466px; height:326px;">    
        <div class="position-relative top-50 start-50 translate-middle d-flex justify-content-center">
          <div class="alert alert-warning" role="alert">
            ${config.alertsMessages.requests.img_load_war_err}
          </div>
        </div>
        </div>
        `;
        $('#img-con').prepend(alertMsg);
        setTimeout(() => {
          $('#al-img').remove();
          $('#dummy-svg').show();
        }, 2000);        
      }      
    } else {
      $('#add-site-url').addClass('is-invalid');
    }
  });
}).fail(function(data) {
  console.log('fail', data);
});
