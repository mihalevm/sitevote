import config from './config/config.json';
import { createAuthWindow, createHeader } from './js/templates/main.tmpl';
import { createSiteAwards, createDescription } from './js/templates/index.tmpl';
import './styles/style.scss';
const container = () => `
<div id="index-main" class="container">

</div>
`;
document.title = config.index.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createSiteAwards('#index-main');
createDescription('#index-main');
