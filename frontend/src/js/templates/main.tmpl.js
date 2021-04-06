import config from '../../config/config.json';
import { Tabs } from 'bootstrap';
import { login } from '../lib/auth';

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
            </div>
            <div class="mb-3">
              <label for="auth-modal-email-pass" class="form-label">${pass}</label>
              <input type="password" class="form-control" id="auth-modal-email-pass" required>                  
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

  $('#auth-modal-close').on('click', function() {
    $('#auth-modal').hide();
  });
  $('#auth-modal-enter').on('click', function() {
    // Two classes active and show
    if($('#auth-email-tab').hasClass('show')) {
      const email = $('#auth-modal-email').val();
      const pass = $('#auth-modal-email-pass').val();
      // Pass check min 8 chars
      // For view
      login(email, pass).done(function() {
        const menuLink = $('#auth-modal-enter-link');
        $('#auth-modal').hide();
        menuLink.text('Выход');
        menuLink.removeAttr("data-bs-toggle");
        menuLink.removeAttr("data-bs-target");
        $('#menu-list').prepend(`<li class="nav-item"><a href="/pages/profile.html" class="nav-link">${config.header_tmpl.profile}</a></li>`);
        $('#menu-list').prepend(`<li class="nav-item"><a href="/pages/select-site.html" class="nav-link">${config.header_tmpl.select}</a></li>`);
      }).fail(function() {
        console.log('fail');
      });
    } else {
      // const number = $('#auth-modal-number').val();
      // const pass = $('#auth-modal-number-pass').val();
      // // Pass check min 8 chars
      // console.log(number, pass);
    }
  });
};

export const createHeader = (el) => {
  // profile gonna be visible only after user autorize
  const tmpl = ({title, enter, select, vote, profile}) => `
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
      <span class="fs-4">${title}</span>
    </a>
    <ul id="menu-list" class="nav nav-pills">      
      <li class="nav-item"><a id="auth-modal-enter-link" href="#" class="nav-link" data-bs-toggle="modal" data-bs-target="#auth-modal">${enter}</a></li>
    </ul>
  </header>
  `;

  // <li class="nav-item"><a href="/pages/vote.html" class="nav-link">${vote}</a></li>
  // <li class="nav-item"><a href="/pages/select-site.html" class="nav-link">${select}</a></li>

  $(el).append(tmpl({ 
    title: config.header_tmpl.title,
    // select: config.header_tmpl.select,
    // profile: config.header_tmpl.profile,
    // vote: config.header_tmpl.vote,
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
