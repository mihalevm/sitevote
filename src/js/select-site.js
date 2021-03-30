import config from '../config/config.json'
import { windowAuth, header } from './templates/main.tmpl';
import { createCards } from './templates/card.tmpl';
import '../styles/style.scss';
const container = () => `
<div class="container-fluid">
  <div class="row pt-3">
    <main>
      <div class="container pt-5">
        <div class="input-group input-group-lg">
          <span class="input-group-text" id="inputGroup-sizing-lg">${config.select_site.search}</span>
          <input type="text" id="sites-cards-search" class="form-control search" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
        </div>
      </div>
      <div class="container pt-5">
        <div id="cards-list" class="row row-cols-4 g-4">
        </div>
      </div>
    </main>
  </div>
</div>
`;

header(document.body);
$(document.body).append(container);
createCards('#cards-list');
windowAuth(document.body);
