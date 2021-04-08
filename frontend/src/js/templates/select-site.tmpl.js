import config from '../../config/config.json';

export const createCards = (el) => {

const tmpl = (header) => `
<div class="col">
<div class="card" style="width: 18rem;">
  <img src="/img/img-site-1.webp" alt="test-img">
  <div class="card-body">
    <h6 class="card-title">${header}</h6>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Посмотреть</a>
  </div>
</div>
</div>
`;

let counter = 1;
let cards = '';
const beginTag = '<div class="row row-cols-1 row-cols-md-4 g-4 pt-3">\n';
const endTag = '\n</div>\n';
$.each(config.cards_tmpl, function(i, v) {
  if(counter == 1) {
    cards = cards + beginTag + tmpl(v);
  }
  if(counter >= 2 && counter < 4) {
    cards = cards + tmpl(v);
  }        
  if(counter == 4) {
    cards = cards + tmpl(v) + endTag;
    counter = 1;    
  } else {
    counter++;
  }  
});
$(el).append(cards);
}

export const createAddSite = (el) => {
  const tmpl = ({ save, url, access_check, description, uniq_url }) => `  
<div class="pb-5">
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-site-modal">
  Добавить сайт
</button>  

<div class="modal fade" id="add-site-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="add-site-modal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="add-site-modal">Добавить сайт</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="add-site-form">
      <div class="modal-body" data-sid="">
        <div class="mb-3">
          <label for="add-site-url" class="form-label">${url}</label>
          <input id="add-site-url" type="text" class="form-control" placeholder="https://google.com" aria-label="add-site-url" aria-describedby="add-site-url">
        </div>
        <div id="img-con" class="mb-3">
          <img id="add-site-img-old" src="/img/img-site-1.webp" alt="test" class="img-fluid pb-3">
          <button id="add-site-check" class="btn btn-primary">${access_check}</button>
        </div>
        <div class="mb-3">
          <label for=add-site-description" class="form-label">${description}</label>          
          <textarea id="add-site-description" class="form-control" placeholder="Описание сайта" style="height: 100px"></textarea>
        </div>
        <div class="input-group mb-3">
          <span for="add-uniq-url" class="input-group-text">${uniq_url}</span>
          <input type="text" class="form-control" placeholder="" aria-label="add-uniq-url" aria-describedby="add-uniq-url">
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
