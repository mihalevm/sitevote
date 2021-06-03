import config from '../../config/config.json';
import { getSRC } from './main.tmpl';
import { isEmpty, onlySpaces } from './../lib/events';

export const createSiteAwards = (arrayOfTopSites) => {
  const rowBeginTag = '<div class="row pt-5">';
  const divEndTag = '</div>'
  let awardsHTML = '';
  awardsHTML = awardsHTML + rowBeginTag;   
  const tmpl = (id, imgLink, cardTitle, cardText) => `  
  <div class="col g-4" style="width:370px; height:416;">
  <div class="card" data-sid="${id}">
    <img src="${getSRC()}/storage/${imgLink}.png" class="card-img-top" alt="Картинка сайта">
    <div class="card-body">
      <h5 class="card-title">${cardTitle}</h5>
      <p class="card-text card-text-extend">${cardText}</p>      
    </div>
  </div>
  </div> 
  `;

  $.each(arrayOfTopSites, function(i, v) {    
    awardsHTML = awardsHTML + tmpl(v.id, v.img_link, v.site_url, (!isEmpty(v.site_desc) && !onlySpaces(v.site_desc)) ? v.site_desc : config.alertsMessages.desc_none);
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
