import config from '../../config/config.json';

export const createAddSite = (el) => {
  const tmpl = ({ save, url, access_check, description, html_block }) => `
<div id="add-site-modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="add-site-modal" aria-hidden="true" >
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${config.add_site.header}</h5>
        <button id="add-site-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div id="add-site-form" data-sid="0" class="modal-body">
        <div class="mb-3">
          <label for="add-site-url" class="form-label">${url}</label>
          <input id="add-site-url" name="site_url" type="text" class="form-control" placeholder="https://google.com" aria-label="add-site-url" aria-describedby="add-site-url">
          <div class="invalid-feedback">${config.validationMessages.url.url_empty_err}</div>
        </div>        
        <div id="img-con" class="mb-3">
          <img id="add-site-img" src="" class="img-fluid pb-3">
          <svg id="dummy-svg" class="bd-placeholder-img pb-3" width="466" height="326" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false">
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#868e96"></rect>
            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Картинка сайта</text>
          </svg>
          <button id="add-site-check" class="btn btn-primary">${access_check}</button>
        </div>
        <div class="mb-3">
          <label for="add-site-description" class="form-label">${description}</label>          
          <textarea id="add-site-description" name="site_desc" class="form-control" placeholder="${config.add_site.site_desc_ph}" style="height: 100px"></textarea>
        </div>        
        <div class="mb-3">
          <label for="add-share-block" class="form-label">${html_block}</label>          
          <textarea id="add-share-block" name="short_link" class="form-control" style="height: 100px" disabled></textarea>
        </div>
      </div>
      <div class="modal-footer">        
        <button id="add-site-save" type="submit" class="btn btn-primary">${save}</button>
      </div>
    </div>
  </div>
</div>
`;
  
  $(el).prepend(tmpl({ 
    save: config.add_site.save,
    url: config.add_site.url,    
    access_check: config.add_site.access_check,    
    description: config.add_site.description,
    html_block: config.add_site.html_block,    
  }));
};
