### Установка
npm install
### Запуск dev-сервера
npm run dev-server
### Cоздание билда
npm run build

Особенности работы webpack plugin [PurgeCSS](https://purgecss.com/plugins/webpack.html#installation):
Данный плагин анализирует используемые в билде *.html, *.js файлах стили и удалаяет из CSS файла неиспользуемые.
Необходимо явно указать путь к директорий или файлу в webpack.config.js .

Особенности работы jQuery:
jQuery доступна в любом js файле билда через [webpack.ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) по именам $, jQuery.
Но при инициализации скрипта в браузере к ней нет доступа.
