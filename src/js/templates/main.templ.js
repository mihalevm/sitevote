import { Tabs } from 'bootstrap';
import config from '../../config/config.json';

export const windowAuth = (el) => {  
  const tmpl = ({title, hint, pass, enter, number, email, byNumber, byEmail}) => `
  <div class="modal" id="auth-modal" tabindex="-1" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${title}</h5>
          <button id="auth-modal-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form>
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
                  <input class="form-control" id="auth-modal-number" aria-describedby="emailHelp">
                  <div id="number-hint" class="form-text">${hint}</div>
                  </div>
                  <div class="mb-3">
                    <label for="auth-modal-number-pass" class="form-label">${pass}</label>
                    <input type="password" class="form-control" id="auth-modal-number-pass">
                  </div>
                </div>
              </div>
            </div>        
          <div class="modal-footer">            
            <button id="auth-modal-enter" type="submit" class="btn btn-primary">${enter}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

  $(el).append(tmpl({ 
    title: config.auth.title, 
    hint: config.auth.hint,
    pass: config.auth.pass,
    enter: config.auth.enter,
    email: config.auth.email,
    number: config.auth.number,
    byNumber: config.auth.byNumber,
    byEmail: config.auth.byEmail,
  }));
  $('#auth-modal-open').on('click', function() {
    $('#auth-modal').show();
  });
  $('#auth-modal-close').on('click', function() {
    $('#auth-modal').hide();
  });
  $('#auth-modal-enter').on('click', function() {
    // Two classes active and show
    if($('#auth-email-tab').hasClass('show')) {
      const email = $('#auth-modal-email').val();
      const pass = $('#auth-modal-email-pass').val();
      // Pass check min 8 chars
      console.log(email, pass);
    } else {
      const number = $('#auth-modal-number').val();
      const pass = $('#auth-modal-number-pass').val();
      // Pass check min 8 chars
      console.log(number, pass);
    }
  });
};

export const header = (el) => {
  const tmpl = ({title, enter, select, vote, profile}) => `
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
      <span class="fs-4">${title}</span>
    </a>

    <ul class="nav nav-pills">
      <li class="nav-item"><a href="#" class="nav-link">${profile}</a></li>
      <li class="nav-item"><a href="#" class="nav-link">${select}</a></li>
      <li class="nav-item"><a href="#" class="nav-link">${vote}</a></li>
      <li class="nav-item"><a id="auth-modal-open" href="#" class="nav-link">${enter}</a></li>
    </ul>
  </header>
  `;
  
  $(el).append(tmpl({ 
    title: config.header.title,
    profile: config.header.profile,
    select: config.header.select,
    vote: config.header.vote,
    enter: config.header.enter
  }));
}
