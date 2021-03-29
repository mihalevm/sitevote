// import { Tabs } from 'bootstrap';
import config from '../config/config.json'
import { windowAuth, header } from './templates/main.tmpl';
import '../styles/style.scss';
const container = ({
  profile, 
  add_site, 
  statistics, 
  fio, 
  email, 
  number, 
  username,
  pass,
  save,
  url,
  access_check,
  pic,
  description,
  uniq_url
}) => `
<nav>
<div class="nav nav-tabs" id="profile-nav-tab" role="tablist">
  <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-profile-tab" type="button" role="tab" aria-controls="" aria-selected="true">${profile}</button>
  <button class="nav-link" id="add-site-tab" data-bs-toggle="tab" data-bs-target="#profile-add-site-tab" type="button" role="tab" aria-controls="" aria-selected="false">${add_site}</button>
  <button class="nav-link" id="statistics-tab" data-bs-toggle="tab" data-bs-target="#profile-statistics-tab" type="button" role="tab" aria-controls="" aria-selected="false">${statistics}</button></div>
</nav>
<div  class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active p-3" id="profile-profile-tab" role="tabpanel" aria-labelledby="email-tab">
    <div class="container">
      <div class="row">
        <main>
          <div class="container pt-5">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">${fio}</span>
              <input type="text" class="form-control" placeholder="Иванов Иван Иванович" aria-label="Username" aria-describedby="basic-addon1">
            </div>          
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon2">${email}</span>
              <input type="text" class="form-control" placeholder="index@google.com" aria-label="Recipient's username" aria-describedby="basic-addon2">
            </div>          
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon3">${number}</span>
              <input type="text" class="form-control" placeholder="+7(999)999-77-88" aria-label="Recipient's username" aria-describedby="basic-addon2">
            </div>   
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon4">${username}</span>
              <input type="text" class="form-control" placeholder="ivanovivan" aria-label="Recipient's username" aria-describedby="basic-addon2">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon5">${pass}</span>
              <input type="password" class="form-control" id="user-password">
            </div>
            <button type="submit" class="btn btn-primary">${save}</button>
          </div>
        </main>
      </div>
    </div>
  </div>
  <div class="tab-pane fade p-3" id="profile-add-site-tab" role="tabpanel" aria-labelledby="">
    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="">
      <div class="container-fluid">
        <div class="row">
          <div class="container">
          <div class="row">
            <main>
              <div class="container pt-5">
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">${url}</span>
                  <input type="text" class="form-control" placeholder="https://google.com" aria-label="Username" aria-describedby="basic-addon1">
                </div>          
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon2">${pic}</span>
                  <button class="btn btn-primary">${access_check}</button>
                </div>          
                <div class="input-group mb-3">
                  <div class="form-floating">
                    <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">${description}</label>
                  </div>                
                </div>   
                <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">${uniq_url}</span>
                  <input type="text" class="form-control" placeholder="Уникальная ссылка сайта" aria-label="Username" aria-describedby="basic-addon1">
                </div> 
                <button type="submit" class="btn btn-primary">${save}</button>
              </div>
            </main>
          </div>
        </div>
        </div>
    </div>
    </div>
  </div>
  <div class="tab-pane fade p-3" id="profile-statistics-tab" role="tabpanel" aria-labelledby="">
    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="">
      <div class="container-fluid">
      <div class="row">
        <main>
          <div class="container pt-5">
            <div class="table-responsive">
              <table class="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1,001</td>
                    <td>random</td>
                    <td>data</td>
                    <td>placeholder</td>
                    <td>text</td>
                  </tr>
                  <tr>
                    <td>1,002</td>
                    <td>placeholder</td>
                    <td>irrelevant</td>
                    <td>visual</td>
                    <td>layout</td>
                  </tr>
                  <tr>
                    <td>1,003</td>
                    <td>data</td>
                    <td>rich</td>
                    <td>dashboard</td>
                    <td>tabular</td>
                  </tr>
                  <tr>
                    <td>1,003</td>
                    <td>information</td>
                    <td>placeholder</td>
                    <td>illustrative</td>
                    <td>data</td>
                  </tr>
                  <tr>
                    <td>1,004</td>
                    <td>text</td>
                    <td>random</td>
                    <td>layout</td>
                    <td>dashboard</td>
                  </tr>
                  <tr>
                    <td>1,005</td>
                    <td>dashboard</td>
                    <td>irrelevant</td>
                    <td>text</td>
                    <td>placeholder</td>
                  </tr>
                  <tr>
                    <td>1,006</td>
                    <td>dashboard</td>
                    <td>illustrative</td>
                    <td>rich</td>
                    <td>data</td>
                  </tr>
                  <tr>
                    <td>1,007</td>
                    <td>placeholder</td>
                    <td>tabular</td>
                    <td>information</td>
                    <td>irrelevant</td>
                  </tr>
                  <tr>
                    <td>1,008</td>
                    <td>random</td>
                    <td>data</td>
                    <td>placeholder</td>
                    <td>text</td>
                  </tr>
                  <tr>
                    <td>1,009</td>
                    <td>placeholder</td>
                    <td>irrelevant</td>
                    <td>visual</td>
                    <td>layout</td>
                  </tr>
                  <tr>
                    <td>1,010</td>
                    <td>data</td>
                    <td>rich</td>
                    <td>dashboard</td>
                    <td>tabular</td>
                  </tr>
                  <tr>
                    <td>1,011</td>
                    <td>information</td>
                    <td>placeholder</td>
                    <td>illustrative</td>
                    <td>data</td>
                  </tr>
                  <tr>
                    <td>1,012</td>
                    <td>text</td>
                    <td>placeholder</td>
                    <td>layout</td>
                    <td>dashboard</td>
                  </tr>
                  <tr>
                    <td>1,013</td>
                    <td>dashboard</td>
                    <td>irrelevant</td>
                    <td>text</td>
                    <td>visual</td>
                  </tr>
                  <tr>
                    <td>1,014</td>
                    <td>dashboard</td>
                    <td>illustrative</td>
                    <td>rich</td>
                    <td>data</td>
                  </tr>
                  <tr>
                    <td>1,015</td>
                    <td>random</td>
                    <td>tabular</td>
                    <td>information</td>
                    <td>text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
  </div>
</div>
  `;

header(document.body);
$(document.body).append(container({
  profile: config.profile.profile, 
  add_site: config.profile.add_site,
  statistics: config.profile.statistics,
  fio: config.profile.fio, 
  email: config.profile.email, 
  number: config.profile.number, 
  username: config.profile.username,
  pass: config.profile.pass,
  save: config.profile.save,
  access_check: config.profile.access_check,
  url: config.profile.url,
  pic: config.profile.pic,
  description: config.profile.description,
  uniq_url: config.profile.uniq_url,
}));
windowAuth(document.body);
