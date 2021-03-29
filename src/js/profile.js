import { Tabs } from 'bootstrap';
import { windowAuth, header } from './templates/main.templ';
import '../styles/style.scss';
const container = () => `
<nav>
<div class="nav nav-tabs" id="nav-tab" role="tablist">
  <button class="nav-link active" id="email-tab" data-bs-toggle="tab" data-bs-target="#auth-email-tab" type="button" role="tab" aria-controls="nav-home" aria-selected="true">${byEmail}</button>
  <button class="nav-link" id="number-tab" data-bs-toggle="tab" data-bs-target="#auth-number-tab" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">${byNumber}</button>
</div>
</nav>
<div  class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active p-3" id="auth-email-tab" role="tabpanel" aria-labelledby="email-tab">
    <div class="container">
      <div class="row">
        <main>
          <div class="container pt-5">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">Профиль</a></li>
              </ol>
            </nav>
          </div>
          <div class="container pt-5">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">ФИО</span>
              <input type="text" class="form-control" placeholder="Иванов Иван Иванович" aria-label="Username" aria-describedby="basic-addon1">
            </div>          
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon2">Email</span>
              <input type="text" class="form-control" placeholder="index@google.com" aria-label="Recipient's username" aria-describedby="basic-addon2">
            </div>          
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon3">Номер телефона</span>
              <input type="text" class="form-control" placeholder="+7(999)999-77-88" aria-label="Recipient's username" aria-describedby="basic-addon2">
            </div>   
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon4">Имя пользователя</span>
              <input type="text" class="form-control" placeholder="ivanovivan" aria-label="Recipient's username" aria-describedby="basic-addon2">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon5">Пароль</span>
              <input type="password" class="form-control" id="user-password">
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  <div class="tab-pane fade p-3" id="profile-number-tab" role="tabpanel" aria-labelledby="number-tab">
    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="email-tab">
    
    </div>
  </div>
</div>
`;

header(document.body);
$(document.body).append(container);
windowAuth(document.body);
