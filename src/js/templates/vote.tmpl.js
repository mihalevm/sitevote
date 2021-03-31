import config from '../../config/config.json';
// 
export const createVote = (el) => {
const tmpl = ({ site_name, img_src, img_alt, vote_opt }) => `
<form>
  <div>
    <h2>${site_name}</h2>
  </div>
  <div>
    <img src="${img_src}" alt="${img_alt}">
  </div>  
  <div class="form-check">
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
  <div>
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
