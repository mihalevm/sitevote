import config from '../../config/config.json';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);
import 'jquery-mask-plugin';

export const createProfile = (el) => {
const tmpl = ({ fio_company, email, number, confirm_pass, pass, save }) => `
<div class="container">
<div class="row pt-5">
  <main>
    <form id="profile-edit-form" class="needs-validation" novalidate>
    <div class="mb-3">      
      <label for="profile-fio" class="form-label">${fio_company}</label>
      <input id="profile-fio" name="fullname" type="text" class="form-control" placeholder="Иванов Иван Иванович\\ООО 'Компания'" aria-label="fio" aria-describedby="profile-fio">      
    </div>          
    <div class="mb-3">
      <label for="profile-email" class="form-label">${email}</label>
      <input id="profile-email" name="email" type="text" class="form-control" placeholder="index@google.com" aria-label="email" aria-describedby="profile-email" required>
      <div id="profile-e-inv" class="invalid-feedback">
      </div>
    </div>          
    <div class="mb-3">
      <label for="profile-number" class="form-label">${number}</label>
      <input id="profile-number" name="phone" type="text" class="form-control" placeholder="89998887766" aria-label="number" aria-describedby="profile-number">
    </div>
    <div class="mb-3">
      <label for="profile-password" class="form-label">${pass}</label>
      <input id="profile-password" name="password" type="password" class="form-control">
      <div class="invalid-feedback">
        Пароль и подтверждение пароля должны быть одинаковыми!
      </div>
    </div>
    <div class="mb-3">
      <label for="profile-confirm-pass" class="form-label" >${confirm_pass}</label>
      <input id="profile-confirm-pass" type="password" class="form-control">
    </div>
    <button id="profile-save" type="submit" class="btn btn-primary">${save}</button>    
    </form>
  </main>
</div>
</div>
`

  $(el).append(tmpl({ 
    fio_company: config.profile.fio_company,  
    email: config.profile.email,
    number: config.profile.number,  
    confirm_pass: config.profile.confirm_pass,
    pass: config.profile.pass,
    save: config.profile.save,
  }));  
  $('#profile-number').mask('000000000000'); 

  const checkEqualPasswords = (pass, passConfirm) => {    
    const saveBtn = $('#profile-save')
    if(pass.val() !== passConfirm.val()) {
      pass.addClass('is-invalid');
      passConfirm.addClass('is-invalid');
      saveBtn.attr('disabled', true);
    } else {
      pass.removeClass('is-invalid');
      passConfirm.removeClass('is-invalid');
      saveBtn.removeAttr('disabled');
    }
  };
  $('#profile-password').on('keyup', function() {
    checkEqualPasswords($('#profile-password'), $('#profile-confirm-pass'));
  });
  $('#profile-confirm-pass').on('keyup', function() {
    checkEqualPasswords($('#profile-password'), $('#profile-confirm-pass'));
  });  
};

export const createProfileTabs = (el) => {
  const tmpl = ({profile, statistics}) => `
  <nav>
  <div class="nav nav-tabs" id="profile-nav-btns" role="tablist">
    <button class="nav-link active" id="profile-btn-tab" data-bs-toggle="tab" data-bs-target="#profile-tab" type="button" role="tab" aria-controls="" aria-selected="true">${profile}</button>  
    <button class="nav-link" id="statistics-btn-tab" data-bs-toggle="tab" data-bs-target="#statistics-tab" type="button" role="tab" aria-controls="" aria-selected="false">${statistics}</button>
  </nav>
  <div class="tab-content" id="profile-tabs">
    <div class="tab-pane fade show active p-3" id="profile-tab" role="tabpanel" aria-labelledby="">
    </div>  
    <div class="tab-pane fade p-3" id="statistics-tab" role="tabpanel" aria-labelledby="">
    </div>  
  </div>
  `;

  $(el).append(tmpl({
    profile: config.profile.profile,  
    statistics: config.profile.statistics,
  }));
};

export const createStatistics = (el) => {
const tmpl = () => `
<div class="row">
  <main>
    <div class="container pt-5">
      <div class="table-responsive">
        <table class="table table-hover table-sm">
          <thead>
            <tr>
              <th>Место</th>
              <th>Название сайта</th>
              <th>Кол-во голосов</th>
              <th>Распостранить</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Винни-Пух</td>
              <td>100</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp" data-url="https://localhost:8080"></div></td>
              <td><a href="#">Удалить</a></div></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Лось и белки</td>
              <td>99</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>
              <td><a href="#">Удалить</a></div></td>
            </tr>           
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
`;
$(el).append(tmpl);
};
  
export const createChart = (el) => {
const tmpl = () => `
<div class="row pt-5">
  <canvas id="chart" class="col"></canvas>
</div>
`;
$(el).append(tmpl);
let ctx = document.getElementById('chart').getContext('2d');
let myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
};
