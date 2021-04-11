import config from '../../config/config.json';
import { siteStats, siteGet } from '../lib/auth';
export const createCards = (el) => {

const tmpl = (id, img_link, url, description, short_link) => `
<div class="col g-4">
<div data-sid="${id}" data-link-short="${short_link}" data-bs-toggle="modal" data-bs-target="#add-site-modal" class="card" style="width: 18rem;">
  <img src="http://sitevote.e-arbitrage.ru/storage/${img_link}.png">
  <div class="card-body">
    <h6 class="card-title">${url}</h6>
    <p class="card-text">${description}</p>    
  </div>
</div>
</div>
`;
  siteStats().done(function(data) {
    // sid == id
    const sites = JSON.parse(data.data);
    console.log(sites);
    let counter = 1;
    let cards = '';
    const beginTag = '<div class="row row-cols-1 row-cols-md-4 g-4 pt-3">\n';
    const endTag = '\n</div>\n';
    $.each(sites, function(i, v) {
      if(counter == 1) {
        cards = cards + beginTag + tmpl(v.id, v.img_link, v.site_url, v.site_desc, v.short_link);
      }
      if(counter >= 2 && counter < 4) {
        cards = cards + tmpl(v.id, v.img_link, v.site_url, v.site_desc, v.short_link);
      }        
      if(counter == 4) {
        cards = cards + tmpl(v.id, v.img_link, v.site_url, v.site_desc, v.short_link) + endTag;
        counter = 1;    
      } else {
        counter++;
      }
    });
    $(el).append(cards);
    
  }).done(function() {
    $('.card').each(function() {
      $(this).on('click', function() {        
        const id = $(this).data('sid');        
        siteGet({sid: id}).done(function(data) {
          const site = JSON.parse(data.data);
          $('#add-site-form').attr('data-sid', site.id);
          for(let v in site) {            
            $(`input[name="${v}"]`).val(site[v]);
          }
          $('#add-site-description').val(site.site_desc)
          $('.modal-title').text(site.site_url);
        });
      });
    });
  });
}

export const createAddSite = (el) => {
  const tmpl = ({ save, url, access_check, description, uniq_url }) => `  
<div class="pb-5">
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-site-modal">
  Добавить сайт
</button>  

<div class="modal fade" id="add-site-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="add-site-modal" aria-hidden="true" >
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Добавить сайт</h5>
        <button id="add-site-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="add-site-form" data-sid="0">
      <div class="modal-body" >
        <div class="mb-3">
          <label for="add-site-url" class="form-label">${url}</label>
          <input id="add-site-url" name="site_url" type="text" class="form-control" placeholder="https://google.com" aria-label="add-site-url" aria-describedby="add-site-url">
          <div class="invalid-feedback">
            Поле URL не может быть пустым!
          </div>
        </div>
        <div id="img-con" class="mb-3">
          <img id="add-site-img" src="" alt="test" class="img-fluid pb-3">
          <div id="access-check-con" class="row">
            <div class="col">
              <button id="add-site-check" class="btn btn-primary">${access_check}</button>
            </div>            
          </div>          
        </div>
        <div class="mb-3">
          <label for=add-site-description" class="form-label">${description}</label>          
          <textarea id="add-site-description" name="site_desc" class="form-control" placeholder="Описание сайта" style="height: 100px"></textarea>
        </div>
        <div class="input-group mb-3">
          <span for="add-uniq-url" class="input-group-text">${uniq_url}</span>
          <input id="add-uniq-url" name="short_link" type="text" class="form-control" aria-label="add-uniq-url" aria-describedby="add-uniq-url">
        </div>
      </div>
      <div class="modal-footer">        
        <button id="add-site-save" type="submit" class="btn btn-primary">${save}</button>
      </div>
      </form> 
    </div>
  </div>
</div>
</div>
`;
  
  $(el).prepend(tmpl({ 
    save: config.select_site.save,
    url: config.select_site.url,    
    access_check: config.select_site.access_check,    
    description: config.select_site.description,
    uniq_url: config.select_site.uniq_url ,  
  }));
};
