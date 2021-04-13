import config from '../../config/config.json';
export const createVote = (el) => {
const tmpl = ({ site_name, img_src, img_alt, description, vote_opt }) => `
<div id="get-the-vote" data-sid="0" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="get-the-vote" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="ya-share2" data-curtain data-size="l" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div>  
        <div>
          <h5 class="pt-5">${site_name}</h5>
        </div>
        <div class="pt-5">
          <img id="get-the-vote-img" src="${img_src}" alt="${img_alt}" class="img-fluid">
        </div>
        <h4 class="pt-5">Описание сайта</h4>
        <div class="pt-5">
          <p id="get-the-vote-desc">
            ${description}
          </p>
        </div>
        <form id="get-the-vote-form" class="pt-5">
          <h4>Блок голосования</h4>
          <div class="form-check pt-3">
            <input class="form-check-input" type="radio" name="vote-opt" id="vote-scholar">
            <label class="form-check-label" for="vote-scholar">
              ${vote_opt.scholar}
            </label>    
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="vote-opt" id="vote-parent" checked>
            <label class="form-check-label" for="vote-parent">
              ${vote_opt.parent}
            </label>    
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="vote-opt" id="vote-teacher">
            <label class="form-check-label" for="vote-teacher">
              ${vote_opt.teacher}
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="vote-opt" id="vote-maecenas">
            <label class="form-check-label" for="vote-maecenas">
              ${vote_opt.maecenas}
            </label>
          </div>
          <div id="save-vote" class="pt-3 pb-5">
            <button type="button" class="btn btn-primary">Голосовать</button>
          </div>  
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
      </div>
    </div>
  </div>
</div>  
`;

$(el).append(tmpl({
  site_name: config.vote.site_name,
  img_src: config.vote.img_src,
  img_alt: config.vote.img_alt,
  description: config.vote.description,
  vote_opt: config.vote.vote_opt
}));
};

// export const createShare = (el) => {
//   const tmpl = () => `
//     <div class="ya-share2" data-curtain data-size="l" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div>
//   `;
//   $(el).append(tmpl());
// }
