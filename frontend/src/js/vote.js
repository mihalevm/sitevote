import config from '../config/config.json'
import { createAuthWindow, createHeader } from './templates/main.tmpl';
import { createVote } from './templates/vote.tmpl';

import '../styles/style.scss';
const container = () => `
<div class="container">
<div id="vote-main" class="row">
  <div class="ya-share2" data-curtain data-size="l" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div>  
</div>       
</div>
`;
document.title = config.vote.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createVote('#vote-main');
