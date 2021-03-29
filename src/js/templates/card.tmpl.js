import config from '../../config/config.json';

export const createCards = (el) => {

const tmpl = (header) => `
<div class="col">
<div class="card" style="width: 18rem;">
  <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
  <div class="card-body">
    <h6>${header}</h6>
  </div>
</div>
</div>
`;

  $.each(config.cards_tmpl, function(i, v){    
    $(el).append(tmpl(v));
  });  
}
