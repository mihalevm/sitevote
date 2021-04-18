import config from '../config/config.json'
import { Modal } from 'bootstrap';
import { checkAuth, siteVerify, siteSave, siteStats, siteGet } from './lib/clientRequests';
import { createAuthWindow, createHeader, createFooter, userLogged, createCards } from './templates/main.tmpl';
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
        <span class="input-group-text">${config.select_site.search}</span>
        <input type="text" id="sites-cards-search" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      </div>
    </div>
    <div id="profile-sites-list" class="container pt-5 pb-5">
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
      $('#add-site-form').attr('data-sid', site.id);
      for(let v in site) {
        $(`input[name="${v}"]`).val(site[v]);
      }          
      $('#add-site-img').attr('src', `http://sitevote.e-arbitrage.ru/storage/${site.img_link}_small.png`);
      $('#add-site-description').val(site.site_desc)
      $('.modal-title').text('Редактирование сайта');
      $('#dummy-svg').hide();
    });
  }; 
  siteStats().done(function(data) {
    const sites = JSON.parse(data.data);              
    if(sites.length <= 12) {       
      $('#profile-sites-list').append(createCards(sites, 'add-site-modal'));
    } else {
      let firstLoadingList = sites.slice(0, 12); 
      let endList = sites.slice(12);
      $('#profile-sites-list').append(createCards(firstLoadingList, 'add-site-modal'));
      $(window).on('scroll', function() {
        if(window.scrollY + window.innerHeight >= document.body.scrollHeight) {
          if(endList.length - 4 >= 0) {
            let slice = endList.slice(0, 4);
            $('#profile-sites-list').append(createCards(slice, 'add-site-modal'));
            $.each(slice, function(i, v) {
              $(`#profile-sites-list [data-sid=${v.id}]`).on('click', function() {
                loadDataToForm(this);
              });
            });
            endList = endList.slice(4);
          } else {            
            $('#profile-sites-list').append(createCards(endList, 'add-site-modal'));            
            $.each(endList, function(i, v) {
              $(`#profile-sites-list [data-sid=${v.id}]`).on('click', function() {
                loadDataToForm(this);
              });
            });
            $(window).off('scroll');
          }
        }
      });
    }    
  }).done(function() {
    $('#profile-sites-list .card').each(function() {
      $(this).on('click', function() {        
        loadDataToForm(this);
      });
    });
  });
  
  
  const clearAddSiteValues = () => {
    // DRY
    $('#add-site-form input').each(function() {
      $(this).val('');
    });
    $('#add-site-description').val('');
    $('#add-site-form').attr('data-sid', '0');
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
          let src = (window.location.origin === "http://localhost:8080") ? 'http://sitevote.e-arbitrage.ru'+ data.data.small : data.data.small;
          // console.log(src);
          $('#add-site-img').attr('src', src);        
          $('#add-site-img').attr('data-origin', data.data.origin);
        } else {          
          const alertMsg = `
          <div id="al-img" style="width:466px; height:326px;">    
          <div class="position-relative top-50 start-50 translate-middle d-flex justify-content-center">
            <div class="alert alert-danger" role="alert">
              Проверьте правильность URL. Картинка сайта не была загружена.
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
    if($('#add-site-url').val().length != 0) {      
      const site = {
        // Refactoring
        sid: parseInt($('#add-site-form').data('sid')),
        site_desc: ($('#add-site-description').val().length !== 0) ? $('#add-site-description').val() : ' ',
        site_url: $('#add-site-url').val(),
        short_link: $('#add-uniq-url').val(),
        img_link: ($('#add-site-img').attr('src') !== '') ? $('#add-site-img').attr('src').split('/storage/')[1].split('_')[0] : $('#add-site-img').data('origin')
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
            Картинка не была загружена. Нажмите кнопку Проверить.
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
