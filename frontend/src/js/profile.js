import config from '../config/config.json'
import { createAuthWindow, createFooter, createHeader } from './templates/main.tmpl';
import { createProfileTabs, createProfile, createStatistics, createChart } from './templates/profile.tmpl';
import { createSiteAwards } from './templates/index.tmpl';
import '../styles/style.scss';

const container = () => `
<div id="profile-main" class="container">
</div>
  `;
document.title = config.profile.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container);
createFooter(document.body);
createProfileTabs('#profile-main');
createProfile('#profile-tab');
createStatistics('#statistics-tab');
createSiteAwards('#statistics-tab');
createChart('#statistics-tab');
