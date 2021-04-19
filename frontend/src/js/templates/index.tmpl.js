import config from '../../config/config.json';

export const createSiteAwards = (arrayOfTopSites) => {
  const rowBeginTag = '<div class="row pt-5">';
  const divEndTag = '</div>'
  let awardsHTML = '';
  awardsHTML = awardsHTML + rowBeginTag;   
  const tmpl = (id, imgLink, cardTitle, cardText) => `  
  <div class="col g-4" style="width:370px; height:416;">
  <div class="card" data-sid="${id}">
    <img src="http://sitevote.e-arbitrage.ru/storage/${imgLink}.png" class="card-img-top" alt="Картинка сайта">
    <div class="card-body">
      <h5 class="card-title">${cardTitle}</h5>
      <p class="card-text card-text-extend">${cardText}</p>      
    </div>
  </div>
  </div> 
  `;

  $.each(arrayOfTopSites, function(i, v) {
    awardsHTML = awardsHTML + tmpl(v.id, v.img_link, v.site_url, v.site_desc);
  })
  awardsHTML = awardsHTML + divEndTag;
  return awardsHTML;
};

export const createDescription = (el) => {
  const tmpl = ({description}) => `
  <div class="row pt-5">
    <p>
      ${description}
    </p>
  </div>
  `;
  $(el).append(tmpl({
    description: config.index.description
  }))
}
// 416X370
