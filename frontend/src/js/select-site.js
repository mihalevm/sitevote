import config from '../config/config.json'
import { createAuthWindow, createHeader, createFooter, userLogged } from './templates/main.tmpl';
import { createAddSite, createCards } from './templates/select-site.tmpl';
import '../styles/style.scss';
import { checkAuth, siteVerify } from './lib/auth';

const container = () => `
<div class="container">
<div class="row pt-3">
  <main>
    <div id="select-site-con" class="container pt-5">
      <div class="input-group input-group-lg">
        <span class="input-group-text">${config.select_site.search}</span>
        <input type="text" id="sites-cards-search" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      </div>
    </div>
    <div id="cards-list" class="container pt-5 pb-5">      
    </div>
  </main>
</div>
</div>
`;

document.title = config.select_site.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
// Проверка аутентфикации
createAddSite('#select-site-con');
createCards('#cards-list');
createFooter(document.body);

$('#sites-cards-search').on('keyup', function() {
  let value = $(this).val().toLowerCase();
  $('#cards-list div.col').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > - 1);    
  })
});  

checkAuth().done(function(data) {
  userLogged();

  $('#add-site-check').on('click', function(e) {
    const url = $('#add-site-url').val();
    e.preventDefault()
    siteVerify({url: url});    
  });
}).fail(function(data) {
  console.log('fail', data);
});
