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
          <span class="input-group-text">${config.select_site.search}</span>
          <input type="text" id="sites-cards-search" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
        </div>
      </div>
      <div id="cards-list" class="container pt-5">
      
      </div>
    </main>
  </div>
</div>
`;

document.title = config.select_site.page_title;
header(document.body);
$(document.body).append(container);
createCards('#cards-list');
windowAuth(document.body);

$('#sites-cards-search').on('keyup', function() {
  let value = $(this).val().toLowerCase();
  $('#cards-list div.col').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > - 1);    
  })
});  

