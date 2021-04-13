import config from '../../config/config.json';
import { siteTop } from '../lib/clientRequests';
export const createSiteAwards = (el) => {
  const tmpl = ({card_title, card_text}) => `
  <div class="card-group pt-5 g-4">
  <div class="card">
    <img src="/img/img-site-1.webp" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${card_title}</h5>
      <p class="card-text">${card_text}</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img src="/img/img-site-2.webp" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${card_title}</h5>
      <p class="card-text">${card_text}</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img src="/img/img-site-3.webp" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${card_title}</h5>
      <p class="card-text">${card_text}</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
  `;

  siteTop({top: 0}).done(function(data) {
    // Top 3 site-Top 18
    const top10 = JSON.parse(data.data);
    console.log('get top sites');
  })

  $(el).append(tmpl({
    card_title: config.index.sites[0].card_title, 
    card_text: config.index.sites[0].card_text
  }));
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
