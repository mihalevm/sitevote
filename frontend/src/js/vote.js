import config from '../config/config.json'
import { createAuthWindow, createHeader, createFooter, userLogged } from './templates/main.tmpl';
import { createVote, createShare } from './templates/vote.tmpl';
import { checkAuth } from './lib/auth';

import '../styles/style.scss';
const container = () => `
<div class="container">
  <div id="vote-main" class="row">    
  </div>
  <div id="vote-share" class="row share-toolbar">    
  </div>
</div>
`;
document.title = config.vote.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createFooter(document.body);
createVote('#vote-main');
createShare('#vote-share');

checkAuth().done(function(data) {
  userLogged();
}).fail(function(data) {
  console.log('fail', data);
});
