import config from '../config/config.json'
import { createAuthWindow, createHeader, createFooter } from './templates/main.tmpl';
import { createVote, createShare } from './templates/vote.tmpl';

import '../styles/style.scss';
const container = () => `
<div class="container">
<div id="vote-main" class="row">
  
</div>       
</div>
`;
document.title = config.vote.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createFooter(document.body);
createVote('#vote-main');
createShare('#vote-main');
