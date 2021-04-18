import config from '../../config/config.json';
import { Tabs } from 'bootstrap';
import { logIn, logOut } from '../lib/clientRequests';
import { emailValidationEvent, passwordValidationEvent } from '../lib/events';

export const userLogged = () => {
  const menuLink = $('#auth-modal-enter-link');
  $('#auth-modal').hide();
  menuLink.text('Выход');
  menuLink.removeAttr('data-bs-toggle');
  menuLink.removeAttr('data-bs-target');
  menuLink.on('click', function() {
    logOut();
  });
  $('#menu-list').prepend(`<li id="profile-link" class="nav-item"><a href="/pages/profile.html" class="nav-link">${config.header_tmpl.profile}</a></li>`);
  $('#menu-list').prepend(`<li id="profile-add-site-link" class="nav-item"><a href="/pages/profile-add-edit-site.html" class="nav-link">${config.header_tmpl.select}</a></li>`);  
};

export const unAuthroizedUser = () => {
  $('#profile-link').remove();
  $('#profile-add-site-link').remove();
};

export const createAuthWindow = (el) => {  
  const tmpl = ({title, hint, pass, enter, number, email, byNumber, byEmail}) => `
  <div id="auth-modal" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="auth-modal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${title}</h5>
        <button id="auth-modal-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" id="email-tab" data-bs-toggle="tab" data-bs-target="#auth-email-tab" type="button" role="tab" aria-controls="nav-home" aria-selected="true">${byEmail}</button>
            <button class="nav-link" id="number-tab" data-bs-toggle="tab" data-bs-target="#auth-number-tab" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">${byNumber}</button>
          </div>
        </nav>
        <div id="auth-modal-tabs" class="tab-content" id="nav-tabContent">
          <div class="tab-pane fade show active p-3" id="auth-email-tab" role="tabpanel" aria-labelledby="email-tab">
            <div class="mb-3">
              <label for="auth-modal-email" class="form-label">${email}</label>
              <input type="email" class="form-control" id="auth-modal-email" aria-describedby="emailHelp" required>
              <div id="email-hint" class="form-text">${hint}</div>
              <div id="auth-e-inv" class="invalid-feedback"></div>
            </div>
            <div class="mb-3">
              <label for="auth-modal-email-pass" class="form-label">${pass}</label>
              <input type="password" class="form-control" id="auth-modal-email-pass" required>
              <div id="pass-e-inv" class="invalid-feedback">                
              </div>
            </div>
          </div>
          <div class="tab-pane fade p-3" id="auth-number-tab" role="tabpanel" aria-labelledby="number-tab">
            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="email-tab">
              <div class="mb-3">
              <label for="auth-modal-number" class="form-label">${number}</label>
              <input class="form-control" id="auth-modal-number" aria-describedby="emailHelp" disabled>
              <div id="number-hint" class="form-text">${hint}</div>
              </div>
              <div class="mb-3">
                <label for="auth-modal-number-pass" class="form-label">${pass}</label>
                <input type="password" class="form-control" id="auth-modal-number-pass" disabled>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="auth-modal-enter" type="submit" class="btn btn-primary">${enter}</button>
      </div>
    </div>
  </div>
</div>
`;

  $(el).append(tmpl({ 
    title: config.auth_tmpl.title, 
    hint: config.auth_tmpl.hint,
    pass: config.auth_tmpl.pass,
    enter: config.auth_tmpl.enter,
    email: config.auth_tmpl.email,
    number: config.auth_tmpl.number,
    byNumber: config.auth_tmpl.byNumber,
    byEmail: config.auth_tmpl.byEmail,
  }));

  $('#auth-modal-email').on('keyup', function() {
    emailValidationEvent(this, '#auth-modal-enter', '#auth-e-inv');
  });
  $('#auth-modal-email-pass').on('keyup', function() {
    passwordValidationEvent('#auth-modal-email-pass', '#auth-modal-enter', '#pass-e-inv');
  });
  
  $('#auth-modal-enter').on('click', function() {
    if($('#auth-email-tab').hasClass('show')) {
      const email = $('#auth-modal-email');
      const pass = $('#auth-modal-email-pass');
      
      if(email.val().length != 0 && pass.val().length != 0) {
        // DRY
        logIn(email.val(), pass.val()).done(function() {        
          userLogged();
        }).fail(function(data) {
          const errMsg = data.responseJSON.detail;
          if(errMsg === 'User UNAUTHORIZED') {
            $('#auth-e-inv').text(config.validationMessages.authentication.unauthorized);
            $('#auth-modal-email').addClass('is-invalid');
          };        
        });
      }
    }
  });
  $('#auth-modal-email-pass').on('keydown', function(e) {    
    const email = $('#auth-modal-email').val();
    const pass = $('#auth-modal-email-pass').val();
    if(e.key && e.key.toLowerCase() == 'enter') {
      if(email.length != 0 && pass.length != 0) {
        // DRY
        logIn(email, pass).done(function() {        
          userLogged();
        }).fail(function(data) {          
          if(data.responseJSON.detail) {
            const errMsg = data.responseJSON.detail;
            if(errMsg === 'User UNAUTHORIZED') {
              $('#auth-e-inv').text(config.validationMessages.authentication.unauthorized);
              $('#auth-modal-email').addClass('is-invalid');
            };        
          } else {
            console.log('Ошибка выполнения запроса.')
          }
        });
      }
    }
  })
};

export const createHeader = (el) => {  
  const tmpl = ({title, enter}) => `
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
      <span class="fs-4">${title}</span>
    </a>
    <ul id="menu-list" class="nav nav-pills">
      <li class="nav-item"><a href="/pages/vote.html" class="nav-link">Голосование</a></li>            
      <li class="nav-item"><a id="auth-modal-enter-link" href="#" class="nav-link" data-bs-toggle="modal" data-bs-target="#auth-modal">${enter}</a></li>
    </ul>
  </header>
  `; 

  $(el).append(tmpl({ 
    title: config.header_tmpl.title,
    enter: config.header_tmpl.enter
  }));
}

export const createFooter = (el) => { 
  const tmpl = () => `
<footer class="footer mt-auto py-3 bg-light">
  <div class="footer-container">
    <span class="text-muted">Place sticky footer content here.</span>
  </div>
</footer>
`;
  $(el).append(tmpl());
};

export const createCards = (arrayOfCards, modalId) => {  
  const card = (id, img_link, url, description, short_link, modal_name) => `
  <div class="col g-4">
  <div data-sid="${id}" data-link-short="${short_link}" data-bs-toggle="modal" data-bs-target="#${modal_name}" class="card" style="width: 18rem;">
    <img src="http://sitevote.e-arbitrage.ru/storage/${img_link}_small.png">
    <div class="card-body">
      <h6 class="card-title"></h6>
      <p class="card-text">${description}</p>    
    </div>
  </div>
  </div>
  `;
  const cardsHTML = (array) => {
    let resultHTML = '';
    const beginTag = '<div class="row row-cols-1 row-cols-md-4 g-4 pt-3">\n';
    const endTag = '\n</div>\n';
    resultHTML += beginTag;
    $.each(array, function(i, v) {      
      resultHTML += card(v.id, v.img_link, v.site_url, v.site_desc, v.short_link, modalId);     
    });
    resultHTML += endTag;    
    return resultHTML;
  }
  return cardsHTML(arrayOfCards);  
};

export const loadingCardIntoPage = (array, parent, idModal, clickCallback) => {
  if(array.length <= 12) {       
    $(parent).append(createCards(array, idModal));
  } else {
    let firstLoadingList = array.slice(0, 12); 
    let endList = array.slice(12);
    $(parent).append(createCards(firstLoadingList, idModal));
    $(window).on('scroll', function() {
      if(window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        if(endList.length - 4 >= 0) {
          let slice = endList.slice(0, 4);
          $(parent).append(createCards(slice, idModal));
          $.each(slice, function(i, v) {
            $(`${parent} [data-sid=${v.id}]`).on('click', function() {
              clickCallback(this);
            });
          });
          endList = endList.slice(4);
        } else {            
          $(parent).append(createCards(endList, idModal));            
          $.each(endList, function(i, v) {
            $(`${parent} [data-sid=${v.id}]`).on('click', function() {
              clickCallback(this);
            });
          });
          $(window).off('scroll');
        }
      }
    });
  } 
};
