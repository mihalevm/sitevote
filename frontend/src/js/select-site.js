import config from '../config/config.json'
import { createAuthWindow, createHeader, createFooter, userLogged } from './templates/main.tmpl';
import { createAddSite, createCards } from './templates/select-site.tmpl';
import '../styles/style.scss';
import { checkAuth, siteVerify, siteSave } from './lib/auth';

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
    $('#add-site-form input').each(function() {
      $(this).val('');
    });
    $('#add-site-description').val('');
    $('#add-site-form').removeAttr('data-sid');
    $('.modal-title').text('Добавить сайт');
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
        const spinner = `
        <div class="d-flex justify-content-center">
          <div id="loading-spinner"class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        `;
        $('#img-con').prepend(spinner);        
      }
  
      req.done(function(data) {
        let src = (window.location.origin === "http://localhost:8080") ? 'http://sitevote.e-arbitrage.ru/'+ data.data.small : data.data.small;
        let srcBig = (window.location.origin === "http://localhost:8080") ? 'http://sitevote.e-arbitrage.ru/'+ data.data.large : data.data.large;
        console.log(src);
        const bigImgModal = `
        <div class="modal fade" id="big-img" aria-hidden="true" aria-labelledby="..." tabindex="-1">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <img id="add-site-img-big" src="${srcBig}" alt="test" class="img-fluid pb-3">
            <div class="modal-footer">
              <a class="btn btn-primary" href="#add-site-modal" data-bs-toggle="modal" data-bs-dismiss="modal" role="button">Назад</a>
            </div>
          </div>
        </div>
        </div>
        `;

        const zoomInBtn = `
          <div class="col">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#big-img" data-bs-dismiss="modal">
              Увеличить
            </button>
          </div>
        `;        
        $(document.body).append(bigImgModal);
        $('#access-check-con').append(zoomInBtn);
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

  $('#add-site-form').on('submit', function(e) {
    e.preventDefault();    
    const newSite = {
      sid: parseInt($('#add-site-form').data('sid')),
      site_desc: $('#add-site-description').val(),
      site_url: $('#add-site-url').val(),
      short_link: $('#add-uniq-url').val(),
      img_link: $('#add-site-img').data('origin')
    };    
    if(newSite.site_url.length != 0) {
      siteSave(newSite).done(function() {
        $('#add-site-form input').each(function() {
          $(this).val('');
        });
        $('#add-site-description').val('');
        $('#add-site-form').removeAttr('data-sid');
        $('.modal-title').text('Добавить сайт');
      });
    } else {
      $('#add-site-url').addClass('is-invalid');
    }    
  });
}).fail(function(data) {
  console.log('fail', data);
});
