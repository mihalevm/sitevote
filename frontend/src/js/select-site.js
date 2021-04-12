import config from '../config/config.json'
import { Modal } from 'bootstrap';
import { createAuthWindow, createHeader, createFooter, userLogged } from './templates/main.tmpl';
import { createAddSite, createCards } from './templates/select-site.tmpl';
import '../styles/style.scss';
import { checkAuth, siteVerify, siteSave } from './lib/clientRequests';

const container = () => `
<div class="container">
<div class="row pt-3">
  <main>
    <div id="select-site-con" class="container pt-5">
      <div class="input-group input-group-lg">
        <span class="input-group-text">${config.select_site.search}</span>
        <input type="text" id="sites-cards-search" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      </div>
    </div>
    <div id="cards-list" class="container pt-5 pb-5">      
    </div>
  </main>
</div>
</div>
`;

document.title = config.select_site.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createAddSite('#select-site-con');
createFooter(document.body);

$('#sites-cards-search').on('keyup', function() {
  let value = $(this).val().toLowerCase();
  $('#cards-list div.col').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > - 1);    
  })
});  

checkAuth().done(function(data) {
  userLogged();
  createCards('#cards-list');
  
  const clearAddSiteValues = () => {
    // DRY
    $('#add-site-form input').each(function() {
      $(this).val('');
    });
    $('#add-site-description').val('');
    $('#add-site-form').removeAttr('data-sid');
    $('.modal-title').text('Добавить сайт');
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
      const req = siteVerify({url: url});
  
      if(req.state() === 'pending') {
        $('#dummy-svg').hide();
        const spinner = `        
        <div class="d-flex justify-content-center">
          <div id="loading-spinner"class="spinner-border" role="status" width="466" height="326">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>        
        `;
        $('#img-con').prepend(spinner);        
      }
  
      req.done(function(data) {
        let src = (window.location.origin === "http://localhost:8080") ? 'http://sitevote.e-arbitrage.ru/'+ data.data.small : data.data.small;
        
        $('#add-site-img').attr('src', src);        
        $('#add-site-img').attr('data-origin', data.data.origin);
        $('#loading-spinner').remove();        
      }).fail(function(data) {
        $('#loading-spinner').remove();
        const alertMsg = `
          <div class="alert alert-primary" role="alert">
            Картинка не может быть загружена. Функция проверки не работает.
          </div>
        `;
        $('#img-con').prepend(alertMsg);
      });
    } else {
      $('#add-site-url').addClass('is-invalid');
    }  
  });

  $('#add-site-save').on('click', function(e) {
    // e.preventDefault();
    if($('#add-site-url').val().length != 0) {
      const newSite = {
        // Refactoring
        sid: parseInt($('#add-site-form').data('sid')),
        site_desc: $('#add-site-description').val(),
        site_url: $('#add-site-url').val(),
        short_link: $('#add-uniq-url').val(),
        img_link: $('#add-site-img').data('origin')
      };     
      siteSave(newSite).done(function() {
        let addSiteModal = new Modal(document.getElementById('add-site-modal'));
        addSiteModal.hide();
        console.log(addSiteModal);
      });
    } else {
      $('#add-site-url').addClass('is-invalid');
    }  
  });
}).fail(function(data) {
  console.log('fail', data);
});
