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

export const createProfile = (el) => {
const tmpl = ({ fio, email, number, username, company_name, confirm_pass, pass, save }) => `
<div class="container">
<div class="row pt-5">
  <main>
    <form id="form-1" action="#" class="needs-validation" novalidate>
    <div class="mb-3">          
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="profile-select-fio-company" id="profile-fio-check" >
        <label for="profile-fio" class="form-label">${fio}</label>
        <input id="profile-fio" type="text" class="form-control" placeholder="Иванов Иван Иванович" aria-label="fio" aria-describedby="profile-fio" disabled>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="profile-select-fio-company" id="profile-company-check" checked>
        <label for="profile-company" class="form-label">${company_name}</label>
        <input id="profile-company" type="text" class="form-control"  placeholder="ООО 'Компания'" aria-label="fio" aria-describedby="profile-fio">
      </div>
    </div>          
    <div class="mb-3">
      <label for="profile-email" class="form-label">${email}</label>
      <input id="profile-email" type="text" class="form-control" placeholder="index@google.com" aria-label="email" aria-describedby="profile-email">
    </div>          
    <div class="mb-3">
      <label for="profile-number" class="form-label">${number}</label>
      <input id="profile-number" type="text" class="form-control" placeholder="+7(999)999-77-88" aria-label="number" aria-describedby="profile-number">
    </div>   
    <div class="mb-3">
      <label for="profile-username" class="form-label">${username}</label>
      <input id="profile-username" type="text" class="form-control" placeholder="ivanovivan" aria-label="username" aria-describedby="profile-username">
    </div>
    <div class="mb-3">
      <label for="profile-password" class="form-label">${pass}</label>
      <input id="profile-password" type="password" class="form-control">
    </div>
    <div class="mb-3">
      <label for="profile-confirm-pass" class="form-label">${confirm_pass}</label>
      <input id="profile-confirm-pass" type="password" class="form-control">
    </div>
    <button id="profile-save" type="submit" class="btn btn-primary">${save}</button>    
    </form>
  </main>
</div>
</div>
`

$(el).append(tmpl({ 
  fio: config.profile.fio,
  company_name: config.profile.company_name,
  email: config.profile.email,
  number: config.profile.number,
  username: config.profile.username,
  confirm_pass: config.profile.confirm_pass,
  pass: config.profile.pass,
  save: config.profile.save,
}));

$('.needs-validation').on('submit', function(event) {  
  if (!this.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
  $(this).addClass('was-validated');
});

const checkEqualPasswords = (pass, passConfirm) => {
  // if(pass.length == 0 || passConfirm.length == 0)
  if(pass === passConfirm) {
    console.log(pass, passConfirm, true);
  } else {
    console.log(pass, passConfirm, false);
  }
};

// Init state can be diff
const changeFieldEnable = () => {
  $('#profile-fio-check').on("click", function() {
    $('#profile-company').attr('disabled', 'true');
    $('#profile-fio').removeAttr('disabled');
  });
  
  $('#profile-company-check').on("click", function() {
    $('#profile-fio').attr('disabled', 'true');
    $('#profile-company').removeAttr('disabled');
  });
}

changeFieldEnable();

$('#profile-save').on('click', function() {
  checkEqualPasswords($('#profile-password').val(), $('#profile-confirm-pass').val());
});
};

export const createAddSite = (el) => {
  const tmpl = ({ save, url, access_check, pic, description, uniq_url }) => `
  <div class="container">
  <div class="row">
    <main>
      <div class="container pt-5">
        <div class="mb-3">
          <label for="profile-url" class="form-label">${url}</label>
          <input type="text" class="form-control" placeholder="https://google.com" aria-label="profile-url" aria-describedby="profile-url">
        </div>
        <div class="mb-3">
          <button id="profile-access-check" class="btn btn-primary">${access_check}</button>
          <label for="profile-access-check" class="form-label">${pic}</label>
        </div>
        <div class="mb-3">          
          <label for="profile-site-description" class="form-label">${description}</label>          
          <textarea id="profile-site-description" class="form-control" placeholder="Описание сайта" style="height: 100px"></textarea>
        </div>
        <div class="mb-3">
        <label for="profile-uniq-url" class="form-label">${uniq_url}</label>
          <input type="text" class="form-control" placeholder="https://link.li/" aria-label="profile-uniq-url" aria-describedby="profile-uniq-url">
        </div>
        <button id="profile-site-save" type="submit" class="btn btn-primary">${save}</button>
      </div>
    </main>
  </div>
  </div>  
  `;
  
  $(el).append(tmpl({ 
    save: config.profile.save,
    url: config.profile.url,
    access_check: config.profile.access_check,
    pic: config.profile.pic,
    description: config.profile.description,
    uniq_url: config.profile.uniq_url ,  
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
              <th>Кол-во голосов</th>
              <th>Распостранить</th>              
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>100</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp" data-url="https://localhost:8080"></div></td>
            </tr>
            <tr>
              <td>2</td>
              <td>99</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>3</td>
              <td>98</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>4</td>
              <td>97</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>5</td>
              <td>96</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>6</td>
              <td>95</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>7</td>
              <td>94</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>8</td>
              <td>93</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>9</td>
              <td>92</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>10</td>
              <td>91</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>11</td>
              <td>90</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>12</td>
              <td>89</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>13</td>
              <td>88</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>14</td>
              <td>87</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>15</td>
              <td>86</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
            </tr>
            <tr>
              <td>16</td>
              <td>85</td>
              <td><div class="ya-share2" data-curtain data-size="s" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,whatsapp"></div></td>              
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
