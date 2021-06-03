import config from '../../config/config.json';
import { Tabs, Modal } from 'bootstrap';
import { logIn, logOut, sendSupportQuestion } from '../lib/clientRequests';
import { emailValidationEvent, fieldLengthEvent, passwordValidationEvent } from '../lib/events';

export const userLogged = () => {
  const menuLink = $('#auth-modal-enter-link');
  $('#auth-modal').hide();
  menuLink.text(config.main_tmpl.exit);
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
  const tmpl = ({title, hint, pass, enter, email}) => `
  <div id="auth-modal" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="auth-modal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${title}</h5>
        <button id="auth-modal-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>      
      <div class="modal-body">
      <form id="auth-form" class="needs-validation" novalidate>    
        <div class="mb-3">
          <label for="auth-modal-email" class="form-label">${email}</label>
          <input id="auth-modal-email" type="email" class="form-control"  aria-describedby="emailHelp" autocomplete="username" required>
          <div id="email-hint" class="form-text">${hint}</div>
          <div id="auth-e-inv" class="invalid-feedback"></div>
        </div>
        <div class="mb-3">
          <label for="auth-modal-email-pass" class="form-label">${pass}</label>
          <input id="auth-modal-email-pass" type="password" class="form-control" autocomplete="current-password" required>
          <div id="pass-e-inv" class="invalid-feedback">                
          </div>
        </div>
      </div>
      </form>   
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
  }));

  const sendEmailPassword = (emailEL, passEl, invDiv) => {    
    if(emailEL.val().length != 0 && passEl.val().length != 0) {    
      logIn(emailEL.val(), passEl.val()).done(function() {        
        userLogged();
      }).fail(function(data) {
        if(data.responseJSON.detail) {
          const errMsg = data.responseJSON.detail;
          if(errMsg === 'User UNAUTHORIZED') {
            invDiv.text(config.validationMessages.authentication.unauthorized);
            emailEL.addClass('is-invalid');
          };        
        } else {
          console.log(config.alertsMessages.requests.send_err);
        }
      });
    }
  };

  $('#auth-modal-email').on('keyup', function() {
    emailValidationEvent(this, '#auth-modal-enter', '#auth-e-inv');
  });
  $('#auth-modal-email-pass').on('keyup', function() {
    passwordValidationEvent('#auth-modal-email-pass', '#auth-modal-enter', '#pass-e-inv');
  });
  
  $('#auth-modal-enter').on('click', function() {    
    const email = $('#auth-modal-email');
    const pass = $('#auth-modal-email-pass');
    const invDiv = $('#auth-e-inv');
    sendEmailPassword(email, pass, invDiv);
  });
  $('#auth-modal-email-pass').on('keydown', function(e) {    
    const email = $('#auth-modal-email');
    const pass = $('#auth-modal-email-pass');
    const invDiv = $('#auth-e-inv');
    if(e.key && e.key.toLowerCase() == 'enter') {
      sendEmailPassword(email, pass, invDiv);
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
    <div class="row">
      <div class="col">
       <span class="text-muted">${config.footer_tmpl.main}</span>    
      </div>
      <div class="col-3">
        <div class="d-flex justify-content-end">
          <a href="#" data-bs-toggle="modal" data-bs-target="#help-modal">Сообщить о проблеме</a>    
        </div>
      </div>
    </div>
  </div>
</footer>
`;
  $(el).append(tmpl());
};

export const createHelp = (el) => {
  const tmpl = ({header, email, desc_header, send}) => `
  <div id="help-modal" class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${header}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="help-email" class="form-label">${email}</label>
            <input id="help-email" type="email" class="form-control" aria-describedby="emailHelp" autocomplete="username" required>          
            <div id="help-e-inv" class="invalid-feedback"></div>
          </div>
          <div class="mb-3">
            <label for="help-message" class="form-label">${desc_header}</label>          
            <textarea id="help-message" class="form-control" style="height: 100px"></textarea>
            <div id="help-msg-inv" class="invalid-feedback"></div>
          </div>
        </div>
        <div class="modal-footer">
          <div id="help-alerts"></div>
          <button id="help-send" type="button" class="btn btn-primary">${send}</button>      
        </div>
      </div>
    </div>
  </div>
  `;
  $(el).append(tmpl({
    header: config.footer_tmpl.help_header,
    email: config.profile.email,
    desc_header: config.vote.desc_header,
    send: config.footer_tmpl.help_send,
  }));

  $('#help-email').on('keyup', function() {
    emailValidationEvent(this, '#help-send', '#help-e-inv');
  });

  $('#help-message').on('keyup', function() {
    fieldLengthEvent(this, '#help-send', '#help-msg-inv');
  });

  $('#help-send').on('click', function() {
    const email = $('#help-email');
    const msgField = $('#help-message');
    if(email.val().length != 0 && msgField.val().length != 0) {
      const send = sendSupportQuestion({email: email.val(), message: msgField.val()});
      if(send.state() === 'pending') {
        $(this).text('')
        const spinner = `<span id="send-msg-spinner" class="spinner-border spinner-border-sm pe-1" role="status" aria-hidden="true"></span> Отправка...`; 
        $(this).append(spinner);
      }
      send.done(function(data) {
        $('#send-msg-spinner').remove();
        $('#help-send').text(config.footer_tmpl.help_send);
        const helpModalEl = document.getElementById('help-modal');
        const helpModal = Modal.getInstance(helpModalEl);
        if(data.data) {
          $('#help-alerts').text(config.alertsMessages.help.success);
          setTimeout(() => {
            $('#help-alerts').text('');
            helpModal.hide();
          }, 5000);
        } else {
          $('#help-alerts').text(config.alertsMessages.requests.send_err);          
          setTimeout(() => {
            $('#help-alerts').text('');
            helpModal.hide();
          }, 5000);
        }
      });
    } else {
      $('#help-email').addClass('is-invalid');
      $('#help-e-inv').text(config.validationMessages.field.empty_err);
      $(this).attr('disabled', true);
    }
  });
} ;

export const createCards = (arrayOfCards, modalId) => {  
  const card = (id, img_link, url, description, short_link, modal_name) => `
  <div class="col g-4">
  <div data-sid="${id}" data-link-short="${short_link}" data-bs-toggle="modal" data-bs-target="#${modal_name}" class="card card-extend" style="width: 18rem;">
    <img src="${getSRC()}/storage/${img_link}_small.png">
    <div class="card-body">
      <h6 class="card-title"></h6>
      <p class="card-text card-text-extend">${description}</p>    
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
      resultHTML += card(v.id, v.img_link, v.site_url, (v.site_desc.trim().length !== 0) ? v.site_desc : config.alertsMessages.desc_none, v.short_link, modalId);     
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

export const getSRC = () => {
  let res = window.location.origin.split(':')[1].split('//')[1];
  if(res === 'localhost') {
    return 'http://sitevote.e-arbitrage.ru';
  } else {
    return window.location.origin;
  }
};
