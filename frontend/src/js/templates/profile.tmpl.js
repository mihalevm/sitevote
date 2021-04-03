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
const tmpl = ({ fio, email, number, username, pass, save }) => `
<div class="container">
<div class="row pt-5">
  <main>    
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
  </main>
</div>
</div>
`

$(el).append(tmpl({ 
  fio: config.profile.fio,
  email: config.profile.email,
  number: config.profile.number,
  username: config.profile.username,
  pass: config.profile.pass,
  save: config.profile.save,
}));
};

export const createAddSite = (el) => {
  const tmpl = ({ save, url, access_check, pic, description, uniq_url }) => `
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
`;
$(el).append(tmpl);
};
  
export const createChart = (el) => {
const tmpl = () => `
<canvas id="chart" width="400" height="400"></canvas>
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
