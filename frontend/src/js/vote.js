import config from '../config/config.json'
import { Modal } from 'bootstrap';
import { createAuthWindow, createHeader, createFooter, 
  userLogged, unAuthroizedUser, loadingCardIntoPage } from './templates/main.tmpl';
import { checkAuthVote, siteSearch, siteVoteGet } from './lib/clientRequests';
import { createVote } from './templates/vote.tmpl';
import '../styles/style.scss';

const container = () => `
<div class="container">
<div class="row pt-3">
  <main>
    <div class="container pt-5">
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item active" aria-current="page">Голосование</li>
    </ol>
    </nav>
    </div>
    <div id="select-site-con" class="container pt-5">
      <div class="input-group input-group-lg">
        <span class="input-group-text">${config.select_site.search}</span>
        <input type="text" id="sites-cards-search" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      </div>
    </div>
    <div id="all-sites-list" class="container pt-5 pb-5">      
    </div>
  </main>
</div>
</div>
`;

document.title = config.select_site.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createFooter(document.body);
createVote(document.body);
const loadDataToForm = (el) => {
  const id = $(el).data('sid');
  siteVoteGet({sid: id}).done(function(data) {
    const site = JSON.parse(data.data);
    const shareBlock = `<div class="ya-share2" data-curtain data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div>`;
    $('#vote-share').append(shareBlock);
    Ya.share2($('#vote-share :first-child')[0], {
      content: {
        url: site.site_url
      }
    });
    $('#get-the-vote h5').text(site.site_url);
    $('#vote-counter').text(`Голосов: ${site.fast_rait}`);
    $('#get-the-vote').attr('data-sid', site.id);
    $('#get-the-vote-img').attr('src', `http://sitevote.e-arbitrage.ru/storage/${site.img_link}.png`);            
    $('#get-the-vote-desc').text(site.site_desc);
  });
};
siteSearch({pattern: ""}).done(function(data) {
  const allSites = JSON.parse(data.data);
  loadingCardIntoPage(allSites, '#all-sites-list', 'get-the-vote', loadDataToForm); 
}).done(function() {
  $('#all-sites-list .card').each(function(data) {    
    $(this).on('click', function() {        
      loadDataToForm(this);
    });
  });
});;

$('#sites-cards-search').on('keyup', function() {
  let value = $(this).val().toLowerCase();
  $('#all-sites-list div.col').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > - 1);    
  })
}); 

checkAuthVote().done(function(data) {  
  userLogged();
}).fail(function(data) {
  unAuthroizedUser();
});
