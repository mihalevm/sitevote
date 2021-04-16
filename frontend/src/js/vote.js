import config from '../config/config.json'
import { Modal } from 'bootstrap';
import { checkAuthVote, siteSearch, siteVoteGet, voteTypes } from './lib/clientRequests';
import { createAuthWindow, createHeader, createFooter, userLogged, createCards, unAuthroizedUser } from './templates/main.tmpl';
import { createVote, createVotes } from './templates/vote.tmpl';
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
siteSearch({pattern: ""}).done(function(data) {
  const allSites = JSON.parse(data.data);
  const cards = createCards(allSites, 'get-the-vote');
  $('#all-sites-list').append(cards);
}).done(function() {
  $('#all-sites-list .card').each(function(data) {    
    $(this).on('click', function() {        
      const id = $(this).data('sid');
      siteVoteGet({sid: id}).done(function(data) {
        const site = JSON.parse(data.data);
        console.log(site);
        $('#get-the-vote-body h5').text(site.site_url);
        $('#get-the-vote').attr('data-sid', site.id);
        $('#get-the-vote-img').attr('src', `http://sitevote.e-arbitrage.ru/storage/${site.img_link}.png`);        
        $('#share-site').attr('data-url', site.site_url);
        $('#get-the-vote-desc').text(site.site_desc);
      });
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
