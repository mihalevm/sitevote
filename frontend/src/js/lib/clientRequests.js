import sha256 from 'crypto-js/sha256';

const URL = 'http://sitevote.e-arbitrage.ru/rest';

const redirectToIndex = function() {
  if(window.location.pathname !== '/') {
    window.location.replace('/');
  }
};

const messageToConsole = (msg) => {
  console.log(msg);
};

const saveTokenToStorage = function(data) {
  if(data.token) {
    localStorage.token = data.token;
    console.log('save token to storage ' + data.token + ' You have successfully accessed to ' + window.location.pathname);
  }
};

const sendAjax = (type, path, successCallback, errorCallback, data) => {
  const ajaxParams = {};
  if(data) {    
    ajaxParams.data = JSON.stringify(data);
  }
  ajaxParams.type = type;
  ajaxParams.url = URL + path;
  ajaxParams.beforeSend = function(xhr) {
    if(localStorage.token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
    }
  };
  ajaxParams.success = successCallback;
  ajaxParams.error = errorCallback;

  return $.ajax(ajaxParams);
};

export const logIn = (username, password) => $.ajax({
  type: "POST",
  url: URL + "/login",
  data: {
    username: username,
    password: sha256(password).toString()
  },
  success: function(data) {
    localStorage.token = data.token;
    console.log(data);
  },
  error: function(data) {    
    console.log(data);
  }
});
export const logOut = () => {
  localStorage.clear();
  window.location.replace('/');
};
export const checkAuth = () => sendAjax('GET', '/authtest', saveTokenToStorage, redirectToIndex);
export const loadProfile = () => sendAjax('POST', '/profile-get', saveTokenToStorage, messageToConsole);
export const updateProfile = (data) => {  
  data.password = sha256(data.password).toString();  
  return sendAjax('POST', '/profile-save', saveTokenToStorage, messageToConsole, data);
};
export const siteStats = (data) => sendAjax('POST', '/site-stats', saveTokenToStorage, messageToConsole, data);
export const siteGet = (data) => sendAjax('POST', '/site-get', saveTokenToStorage, messageToConsole, data);
export const siteVerify = (data) => sendAjax('POST', '/site-verify', saveTokenToStorage, messageToConsole, data);
export const siteSave = (data) => sendAjax('POST', '/site-save', saveTokenToStorage, messageToConsole, data);
export const siteDel = (data) => sendAjax('POST', '/site-del', saveTokenToStorage, messageToConsole, data); // Not working
export const siteProfileSearch = (data) => sendAjax('POST', '/site-profile-search', saveTokenToStorage, messageToConsole, data); // Not working
export const siteSearch = (data) => sendAjax('POST', '/site-search', saveTokenToStorage, messageToConsole, data);
export const siteVoteGet = (data) => sendAjax('POST', '/site-vote-get', saveTokenToStorage, messageToConsole, data); // Not working Голосование
export const voteTypes = (data) => sendAjax('POST', '/vote-types', saveTokenToStorage, messageToConsole, data); // Not working Голосование
export const siteTop = (data) => sendAjax('POST', '/site-top', saveTokenToStorage, messageToConsole, data); // Not working 18 сайтов
