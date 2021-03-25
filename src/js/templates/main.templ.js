export const windowAuth = (el) => {
  const tmpl = ({title, hint, pass, enter}) => `
    <div class="modal" id="auth-modal" tabindex="-1" style="display: none;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button id="auth-modal-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form>
            <div class="modal-body">
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
            <div class="modal-footer">            
              <button type="submit" class="btn btn-primary">${enter}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  return $.ajax({
    type: 'GET',
    url: '/config/config.json',
  }).done(function(data){
    const content = data.auth;
    $(el).append(tmpl({ 
      title: content.title, 
      hint: content.hint,
      pass: content.pass,
      enter: content.enter
    }));
  }).done(function(){
    $('#auth-enter').on("click", function() {
      $('#auth-modal').show();    
    });
    $('#auth-modal-close').on("click", function() {
      $('#auth-modal').hide();
    });
  });  
};
