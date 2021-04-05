import config from '../../config/config.json';

export const createCards = (el) => {

const tmpl = (header) => `
<div class="col">
<div class="card" style="width: 18rem;">
  <img src="/img/img-site-1.webp" alt="test-img">
  <div class="card-body">
    <h6 class="card-title">${header} <span class="badge bg-secondary">Компания</span></h6>
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
