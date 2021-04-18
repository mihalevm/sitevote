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
const loadDataToForm = (el) => {
  const id = $(el).data('sid');
  siteVoteGet({sid: id}).done(function(data) {
    const site = JSON.parse(data.data);
    $('#get-the-vote-body h5').text(site.site_url);
    $('#get-the-vote').attr('data-sid', site.id);
    $('#get-the-vote-img').attr('src', `http://sitevote.e-arbitrage.ru/storage/${site.img_link}.png`);        
    $('#share-site').attr('data-url', site.site_url);
    $('#get-the-vote-desc').text(site.site_desc);
  });
};
siteSearch({pattern: ""}).done(function(data) {
  const allSites = JSON.parse(data.data);
  if(allSites.length <= 12) {       
    $('#all-sites-list').append(createCards(allSites, 'get-the-vote'));
  } else {
    let firstLoadingList = allSites.slice(0, 12); 
    let endList = allSites.slice(12);
    $('#all-sites-list').append(createCards(firstLoadingList, 'get-the-vote'));
    $(window).on('scroll', function() {
      if(window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        if(endList.length - 4 >= 0) {
          let slice = endList.slice(0, 4);
          $('#all-sites-list').append(createCards(slice, 'get-the-vote'));
          $.each(slice, function(i, v) {
            $(`#all-sites-list [data-sid=${v.id}]`).on('click', function() {
              loadDataToForm(this);
            });
          });
          endList = endList.slice(4);
        } else {            
          $('#all-sites-list').append(createCards(endList, 'get-the-vote'));            
          $.each(endList, function(i, v) {
            $(`#all-sites-list [data-sid=${v.id}]`).on('click', function() {
              loadDataToForm(this);
            });
          });
          $(window).off('scroll');
        }
      }
    });
  }  
}).done(function() {
  $('#all-sites-list .card').each(function(data) {    
    $(this).on('click', function() {        
      const id = $(this).data('sid');
      siteVoteGet({sid: id}).done(function(data) {
        const site = JSON.parse(data.data);        
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
