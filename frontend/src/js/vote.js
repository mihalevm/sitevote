import config from '../config/config.json'
import { Modal } from 'bootstrap';
import { createAuthWindow, createHeader, createFooter, 
  userLogged, unAuthroizedUser, loadingCardIntoPage, getSRC, createHelp } from './templates/main.tmpl';
import { checkAuthVote, siteSearch, siteVoteGet } from './lib/clientRequests';
import { createVote } from './templates/vote.tmpl';
import { alertMsg }  from './lib/events';
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
        <span class="input-group-text">${config.add_site.search}</span>
        <input type="text" id="sites-cards-search" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      </div>
    </div>
    <div id="all-sites-list" class="container pt-5 pb-5">      
    </div>
  </main>
</div>
</div>
`;

document.title = config.vote.page_title;
createHeader(document.body);
createAuthWindow(document.body);
createHelp(document.body);
$(document.body).append(container);
createFooter(document.body);
createVote(document.body);

const gettingVote = (id) => {
  siteVoteGet({sid: id}).done(function(data) {
    const site = JSON.parse(data.data);
    const shareBlock = `<div class="ya-share2" data-curtain data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp" data-description="Голосуйте за мой сайт"></div>`;
    $('#vote-share').append(shareBlock);
    Ya.share2($('#vote-share :first-child')[0], {
      content: {
        url: `${getSRC()}/pages/vote.html?sid=${site.id}`,
      }
    });
    $('#get-the-vote h5 > a').attr('href', site.site_url);
    $('#get-the-vote h5 > a').text(site.site_url);
    $('#vote-counter').text(`Голосов: ${site.fast_rait}`);
    $('#get-the-vote').attr('data-sid', site.id);
    $('#get-the-vote-img').attr('src', `${getSRC()}/storage/${site.img_link}.png`);
    $('#get-the-vote-desc').text(site.site_desc);
  });
};

const loadDataToForm = (el) => {
  const id = $(el).data('sid');
  gettingVote(id);
};

const firstPageLoading = () => {
  siteSearch({pattern: ""}).done(function(data) {
    const allSites = JSON.parse(data.data);    
    loadingCardIntoPage(allSites, '#all-sites-list', 'get-the-vote', loadDataToForm); 
    return allSites;
  }).done(function(data) {
    $('#all-sites-list .card').each(function(data) {    
      $(this).on('click', function() {        
        loadDataToForm(this);
      });
    });
    const allSites = JSON.parse(data.data);
    const idS = []
    $.each(allSites, function(i,v) {
      idS.push(v.id);    
    })  
    const params = new URLSearchParams(window.location.search);
    let id;
    if(params.has('sid')) {
      id = params.get('sid');
      if(id) {
        if(idS.includes(parseInt(id))) {
          const voteModalEl = document.getElementById('get-the-vote');
          const voteModal = new Modal(voteModalEl, {
            keyboard: false
          });  
          voteModal.show();
          gettingVote(id);
        }      
      }
    }  
  });
}
firstPageLoading();

let timerId = null
$('#sites-cards-search').on('keyup', function() {
  $('#all-sites-list').children().remove();
  $(window).off('scroll');
  let searchStr = $(this).val().toLowerCase();  
  if(searchStr.length > 0) {
    if(timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {    
      siteSearch({pattern: searchStr}).done(function(data) {
        if(data.error == 200) {
          const allSites = JSON.parse(data.data);
          loadingCardIntoPage(allSites, '#all-sites-list', 'get-the-vote', loadDataToForm);
        } else {
          $('#all-sites-list').append(alertMsg('search','warning',`По вашему запросу "${searchStr}" ничего не нашлось`));
        }
      }).done(function(data) {
        $('#all-sites-list .card').each(function(data) {
          $(this).on('click', function() {        
            loadDataToForm(this);
          });
        }); 
      });
    }, 1000);
  } else {
    firstPageLoading();
  }
}); 

checkAuthVote().done(function(data) {  
  userLogged();
}).fail(function(data) {
  unAuthroizedUser();
});
