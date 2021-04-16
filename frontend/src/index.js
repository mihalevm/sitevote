import config from './config/config.json';
import { createAuthWindow, createHeader, createFooter, userLogged } from './js/templates/main.tmpl';
import { createChart } from './js/templates/profile.tmpl';
import { createSiteAwards, createDescription } from './js/templates/index.tmpl';
import { checkAuth, siteTop } from './js/lib/clientRequests';
import './styles/style.scss';

const container = () => `
<div id="index-main" class="container">
</div>
`;
document.title = config.index.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createDescription('#index-main');
createFooter(document.body);
siteTop({top: 3}).done(function(data) {
  // Top 3
  const top3 = JSON.parse(data.data);
  $('#index-main').prepend(createSiteAwards(top3));
});
createChart('#index-main');

checkAuth().done(function(data) {
  userLogged()
}).fail(function(data) {
  console.log('fail', data);
});

