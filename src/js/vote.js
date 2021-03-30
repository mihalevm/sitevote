import { windowAuth, header } from './templates/main.tmpl';
import '../styles/style.scss';
const container = () => `
  <div class="container-fluid">
    <div class="row">
      <main>
        <div class="container pt-5">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">Голосование</a></li>
            </ol>
          </nav>
        </div>
      </main>
    </div>
  </div>
`;
header(document.body)
$(document.body).append(container);
windowAuth(document.body);

