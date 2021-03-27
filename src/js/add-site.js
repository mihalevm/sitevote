import { windowAuth, header } from './templates/main.templ';
import '../styles/style.scss';
const container = () => `
  <div class="container-fluid">
    <div class="row">
      <main>
        <div class="container pt-5">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">Добавление сайта</a></li>
            </ol>
          </nav>
        </div>
      </main>
    </div>
  </div>
`;
header(document.body).done(function() {
  $(document.body).append(container);
})
windowAuth(document.body);
