import config from '../config/config.json'
import { createAuthWindow, createHeader } from './templates/main.tmpl';
import '../styles/style.scss';
const container = () => `
<div class="container">
<div class="row">
    <form>
    <div>
      <h2>Участник №1</h2>
    </div>
    <div>
      <img src="/img/img-site-1.webp" alt="test-img">
    </div>
    <div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="vote-scholar">
        <label class="form-check-label" for="flexRadioDefault1">
          Ученик
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="vote-parent" checked>
        <label class="form-check-label" for="flexRadioDefault2">
          Родитель
        </label>
        </div>
      </div>
      <div class="form-check">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="vote-teacher">
      <label class="form-check-label" for="flexRadioDefault1">
        Педагог
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="vote-maecenas" checked>
      <label class="form-check-label" for="flexRadioDefault2">
        Меценат
      </label>
      </div>
    </div>
    <div>
      <button type="button" class="btn btn-primary">Голосовать</button>
    </div>
    <div>
      <div class="ya-share2" data-curtain data-size="l" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div>
    </div>    
  </form>      
</div>       
</div>
`;
document.title = config.vote.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
