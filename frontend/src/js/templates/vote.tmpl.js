import config from '../../config/config.json';
import { voteTypes, voteEmailSendConfirm } from '../lib/clientRequests';
import { emailValidationEvent } from '../lib/events';
export const createVote = (el) => {
const tmpl = () => `
<div id="get-the-vote" data-sid="0" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="get-the-vote" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="get-the-vote-body">
          <div class="row rows-cols-2">
            <div class="col">
              <div class="d-flex justify-content-start">
                <h5 id="vote-counter"></h5>
              </div>
            </div>
            <div class="col">
              <div id="vote-share" class="d-flex justify-content-end">                
              </div>
            </div>
          </div>      
          <div class="pt-5">
            <img id="get-the-vote-img" src="" class="img-fluid">
          </div>
          <h4 class="pt-5">Описание:</h4>
          <div class="pt-5">
            <p id="get-the-vote-desc">              
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>  
`;

  $(el).append(tmpl());

  voteTypes().done(function(data) {
    const votes = JSON.parse(data.data);    
    const votesBlock = createVotes(votes);      
    $('#get-the-vote-body').append(votesBlock);     
  }).done(function(data) {
    $($('#select-role :first-child')).attr('selected', true);
    $('#save-vote-email').on('keyup', function() {
      emailValidationEvent('#save-vote-email', '#save-vote', '#save-v-e-inv');
    });    
    $('#save-vote').on('click', function() {
      emailValidationEvent('#save-vote-email', '#save-vote', '#save-v-e-inv');      
      const vote = {
        sid: parseInt($('#get-the-vote').attr('data-sid')),
        vtype: parseInt($(':selected').data('vtype')),
        email: $('#save-vote-email').val()
      };      
      if($('#save-vote-email').val != 0) {        
        voteEmailSendConfirm(vote).done(function(data) {
          if(data.data) {
            // Вы успешно проголосовали
          }
        }).fail(function(data){
          console.log('Ошибка отправки запроса');
        });
      }
    });
  });
};
export const createVotes = (arrayOfVotes) => { 
  const beginTag = `
  <form id="get-the-vote-form" class="d-flex justify-content-center pt-5">
  <div class="row g-3 pt-5 pb-5">
    <div class="col-auto">
      <label for="select-role" class="pt-2 form-label">Роль</label>
    </div>
    <div class="col-auto">
      <select id="select-role" class="form-select" aria-label="Роль">`;
  const endTag = `</select></div>`;
  const vote = (id, value) => `
  <option id="vote-${id}" data-vtype=${id} value="${id}">${value}</option>
  `;
  const saveVoteBlock = `  
      <div class="col-auto">
        <label for="save-vote-email" class="pt-2 form-label">Email</label>
      </div>
      <div class="col-auto">     
        <input id="save-vote-email" type="email" class="form-control" aria-describedby="emailHelp" required>
        <div id="save-v-e-inv" class="invalid-feedback"></div>
      </div>
      <div class="col-auto">
        <button id="save-vote" type="button" class="btn btn-primary">${config.vote.vote_btn}</button>
      </div>
    </div>
  </form>
  `;
  let votesHTML = '';
  votesHTML += beginTag;
  $.each(arrayOfVotes, function(i,v) {    
    votesHTML += vote(v.id, v.value);
  });
  votesHTML += endTag + saveVoteBlock;
  return votesHTML
};
