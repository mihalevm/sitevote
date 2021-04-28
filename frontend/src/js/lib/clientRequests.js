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
  url: URL + "/login",
  type: "POST",
  data: {
    username: username,
    password: sha256(password).toString()
  },
  success: function(data) {
    if(data.token) {    
      localStorage.token = data.token;    
    }
  },
  error: function(data) {    
    console.log(data);
  }
});
export const logOut = () => {
  localStorage.clear();
  window.location.replace('/');
};

export const checkAuthVote = () => sendAjax('GET', '/authtest', saveTokenToStorage, messageToConsole('Не авторизованный пользователь'));
export const checkAuth = () => sendAjax('GET', '/authtest', saveTokenToStorage, redirectToIndex);
export const accountConfirm = (data) => sendAjax('POST', '/account-confirm', saveTokenToStorage, messageToConsole, data);
export const profileGet = () => sendAjax('POST', '/profile-get', saveTokenToStorage, messageToConsole);
export const profileSave = (data) => {  
  data.password = sha256(data.password).toString();  
  return sendAjax('POST', '/profile-save', saveTokenToStorage, messageToConsole, data);
};
export const siteStats = (data) => sendAjax('POST', '/site-stats', saveTokenToStorage, messageToConsole, data);
export const siteGet = (data) => sendAjax('POST', '/site-get', saveTokenToStorage, messageToConsole, data);
export const siteVerify = (data) => sendAjax('POST', '/site-verify', saveTokenToStorage, messageToConsole, data);
export const siteSave = (data) => sendAjax('POST', '/site-save', saveTokenToStorage, messageToConsole, data);
export const siteDel = (data) => sendAjax('POST', '/site-del', saveTokenToStorage, messageToConsole, data);
export const siteSearch = (data) => sendAjax('POST', '/site-search', saveTokenToStorage, messageToConsole, data);
export const siteVoteGet = (data) => sendAjax('POST', '/site-vote-get', saveTokenToStorage, messageToConsole, data);
export const voteTypes = (data) => sendAjax('POST', '/vote-types', saveTokenToStorage, messageToConsole, data); 
export const siteTop = (data) => sendAjax('POST', '/site-top', saveTokenToStorage, messageToConsole, data);
export const voteEmailSendConfirm = (data) => sendAjax('POST', '/vote-email-send-confirm', saveTokenToStorage, messageToConsole, data);
export const voteEmailConfirm = (data) => sendAjax('POST', '/vote-email-confirm', saveTokenToStorage, messageToConsole, data);
export const sendSupportQuestion = (data) => sendAjax('POST', '/send-support-question', saveTokenToStorage, messageToConsole, data);
// export const siteProfileSearch = (data) => sendAjax('POST', '/site-profile-search', saveTokenToStorage, messageToConsole, data); // Not working
