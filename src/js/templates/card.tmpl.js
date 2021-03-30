import config from '../../config/config.json';

export const createCards = (el) => {

const tmpl = (header) => `
<div class="col">
<div class="card" style="width: 18rem;">
  <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
  <div class="card-body">
    <h6 class="ch">${header}</h6>
  </div>
</div>
</div>
`;

let counter = 1;
let cards = '';
const beginTag = '<div class="row row-cols-1 row-cols-md-4 g-4 pt-3">\n';
const endTag = '\n</div>\n';
$.each(config.cards_tmpl, function(i, v){
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
