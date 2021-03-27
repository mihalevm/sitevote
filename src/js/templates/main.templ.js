import { Tabs } from 'bootstrap';
import config from '../../config/config.json';

export const windowAuth = (el) => {  
  const tmpl = ({title, hint, pass, enter, number, email}) => `
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
                  <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">${email}</button>
                  <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">${number}</button>
                </div>
              </nav>
                <div class="tab-content" id="nav-tabContent">
                  <div class="tab-pane fade show active p-3" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                  <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Email</label>
                  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                  <div id="emailHelp" class="form-text">${hint}</div>
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">${pass}</label>
                    <input type="password" class="form-control" id="exampleInputPassword1">
                  </div>
                </div>
                <div class="tab-pane fade p-3" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">${number}</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                    <div id="emailHelp" class="form-text">${hint}</div>
                    </div>
                    <div class="mb-3">
                      <label for="exampleInputPassword1" class="form-label">${pass}</label>
                      <input type="password" class="form-control" id="exampleInputPassword1">
                    </div>
                  </div>
                </div>                
              </div>                     
            </div>
            <div class="modal-footer">            
              <button type="submit" class="btn btn-primary">${enter}</button>
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
    number: config.auth.number,
    email: config.auth.email,
  }));
  $('#auth-enter').on('click', function() {
    $('#auth-modal').show();
  });
  $('#auth-modal-close').on('click', function() {
    $('#auth-modal').hide();
  });
};

export const header = (el) => {
  const tmpl = ({title, enter, profile}) => `
    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">${title}</a>
      <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a href="#">${profile}</a>
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a id="auth-enter" class="nav-link" href="#">${enter}</a>
        </li>
      </ul>
    </header>
  `;
  
  $(el).append(tmpl({ 
    title: config.header.title,
    profile: config.header.profile,
    enter: config.header.enter
  }));
}
