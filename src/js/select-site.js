import List from 'list.js';
import { windowAuth, header } from './templates/main.templ';
import { cards } from './templates/cards.templ';
import '../styles/style.scss';
const container = () => `
<div class="container-fluid">
  <div class="row pt-3">
    <main id="sites">
      <div class="container pt-5">
        <div class="input-group input-group-lg">
          <span class="input-group-text" id="inputGroup-sizing-lg">Поиск</span>
          <input type="text" id="sites-cards-search" class="form-control search" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
        </div>
      </div>
      <div id="cards-main" class="container pt-5">  
      </div>
    </main>
  </div>
</div>
`;

header(document.body);
$(document.body).append(container);
cards('#cards-main');
windowAuth(document.body);

// Hide block list but not by value

let opt = ['site-name', 'card-text', 'check-lang'];
let sitesList = new List('sites', opt);
console.log(sitesList);
