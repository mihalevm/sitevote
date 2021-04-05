// import { Tabs } from 'bootstrap';
import config from '../config/config.json'
import { createAuthWindow, createFooter, createHeader } from './templates/main.tmpl';
import { createProfile, createAddSite, createStatistics, createChart } from './templates/profile.tmpl';
import '../styles/style.scss';

const container = ({ profile, add_site, statistics, chart }) => `
<div class="container">
<nav>
<div class="nav nav-tabs" id="profile-nav-btns" role="tablist">
  <button class="nav-link active" id="profile-btn-tab" data-bs-toggle="tab" data-bs-target="#profile-tab" type="button" role="tab" aria-controls="" aria-selected="true">${profile}</button>
  <button class="nav-link" id="add-site-btn-tab" data-bs-toggle="tab" data-bs-target="#add-site-tab" type="button" role="tab" aria-controls="" aria-selected="false">${add_site}</button>
  <button class="nav-link" id="statistics-btn-tab" data-bs-toggle="tab" data-bs-target="#statistics-tab" type="button" role="tab" aria-controls="" aria-selected="false">${statistics}</button>
  <button class="nav-link" id="chart-btn-tab" data-bs-toggle="tab" data-bs-target="#chart-tab" type="button" role="tab" aria-controls="" aria-selected="false">${chart}</button>
</nav>
<div class="tab-content" id="profile-tabs">
  <div class="tab-pane fade show active p-3" id="profile-tab" role="tabpanel" aria-labelledby="">
  </div>
  <div class="tab-pane fade p-3" id="add-site-tab" role="tabpanel" aria-labelledby="">
  </div>
  <div class="tab-pane fade p-3" id="statistics-tab" role="tabpanel" aria-labelledby="">
  </div>
  <div class="tab-pane fade p-3" id="chart-tab" role="tabpanel" aria-labelledby="">
  </div>
</div>
</div>
  `;
document.title = config.profile.page_title;
createHeader(document.body);
createAuthWindow(document.body);
$(document.body).append(container({
  profile: config.profile.profile,
  add_site: config.profile.add_site,
  statistics: config.profile.statistics,
  chart: config.profile.chart
}));
createFooter(document.body);
createProfile('#profile-tab');
createAddSite('#add-site-tab');
createStatistics('#statistics-tab');
createChart('#chart-tab');
