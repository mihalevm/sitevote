import config from '../../config/config.json';
// 
export const createVote = (el) => {
const tmpl = ({ site_name, img_src, img_alt, vote_opt }) => `
<form>
  <div>
    <h5 class="pt-3">${site_name} <span class="badge bg-secondary">Компания</span></h5>
  </div>
  <div class="pt-3">
    <img src="${img_src}" alt="${img_alt}">
  </div>  
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
  <div class="pt-3">
    <button type="button" class="btn btn-primary">Голосовать</button>
  </div>    
</form>
`;

$(el).append(tmpl({
  site_name: config.vote.site_name,
  img_src: config.vote.img_src,
  img_alt: config.vote.img_alt,
  vote_opt: config.vote.vote_opt
}));
};

export const createShare = (el) => {
  const tmpl = () => `
  <div class="ya-share2 pt-3 pb-3" data-curtain data-size="l" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div>  
  `;
  $(el).append(tmpl());
}
