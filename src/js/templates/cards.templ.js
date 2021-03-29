import config from '../../config/config.json';

export const cards = (el) => {
//
const tmpl = ({h1, h2, h3, h4}) => `
  <div class="row pt-3 list">
    <div class="col">
      <div class="card" style="width: 18rem;">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
        <h6 class="site-name">${h1}</h6>
        <div class="card-body">
          <p class="card-text">1</p>
          <p class="check-lang">Omega</p>
        </div>
      </div>              
    </div>
    <div class="col">
      <div class="card" style="width: 18rem;">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
        <h6 class="site-name">${h2}</h6>
        <div class="card-body">
          <p class="card-text">2</p>
          <p class="check-lang">Suffix</p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card" style="width: 18rem;">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
        <h6 class="site-name">${h3}</h6>
        <div class="card-body">
          <p class="card-text">3</p>
          <p class="check-lang">Index</p>
        </div>
      </div>              
    </div>
    <div class="col">
      <div class="card" style="width: 18rem;">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
        <h6 class="site-name">${h4}</h6>
        <div class="card-body">
          <p class="card-text">4</p>
          <p class="check-lang">Red</p>
        </div>
      </div>              
    </div>
  </div>
`;

  $(el).append(tmpl({ 
    h1: config.cards_tmpl.h1,
    h2: config.cards_tmpl.h2,
    h3: config.cards_tmpl.h3,
    h4: config.cards_tmpl.h4,    
  }));
}
