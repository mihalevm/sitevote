import sha256 from 'crypto-js/sha256';

const URL = 'http://sitevote.e-arbitrage.ru/rest';

const redirectToIndex = function() {
  if(window.location.pathname !== '/') {
    window.location.replace('/');
  }
};

const messageToConsole = function() {
  console.log('Verify not loaded');
};

const saveTokenToStorage = function(data) {  
  localStorage.token = data.token;        
  console.log('save token to storage ' + data.token + ' You have successfully accessed to ' + window.location.pathname);
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

export const siteVerify = (url) => sendAjax('POST', '/site-verify', saveTokenToStorage, messageToConsole, url);
export const checkAuth = () => sendAjax('GET', '/authtest', saveTokenToStorage, redirectToIndex);
export const loadProfile = () => sendAjax('POST', '/profile-get', saveTokenToStorage, messageToConsole);
export const updateProfile = (data) => {  
  data.password = sha256(data.password).toString();  
  return sendAjax('POST', '/profile-save', saveTokenToStorage, messageToConsole, data);
}
export const saveSite = (data) => sendAjax('POST', '/site-save', saveTokenToStorage, messageToConsole, data);


// export const updateProfile = ({email, password, fullname, phone, user_desc}) => $.ajax({
//   type: 'POST',
//   url: URL + "/profile-save",
//   beforeSend: function(xhr) {
//     if(localStorage.token) {
//       xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
//     }
//   },  
//   data: JSON.stringify({
//     email: email,
//     password: sha256(password).toString(),
//     fullname: fullname,
//     phone: phone,
//     user_desc: user_desc
//   }),
//   success: function(data) {
//     localStorage.token = data.token;    
//     console.log('User updated')
//   },
//   error: function(data) {    
//     console.log('User not updated')
//   }
// });

// export const checkAuth = () => $.ajax({
//   type: 'GET',
//   url: URL + "/authtest",
//   beforeSend: function(xhr) {
//     if(localStorage.token) {
//       xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
//     }
//   },
//   success: function(data) {
//     localStorage.token = data.token;        
//     console.log(data.token + ' You have successfully accessed to ' + window.location.pathname);
//   },
//   error: function(data) {    
//     if(window.location.pathname !== '/') {
//       window.location.replace('/');
//     }
//   }
// });

// export const siteVerify = (url) => $.ajax({
//   type: 'POST',
//   url: URL + "/site-verify",
//   beforeSend: function(xhr) {
//     if(localStorage.token) {
//       xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
//     }
//   },  
//   data: JSON.stringify(url),  
//   success: function(data) {
//     localStorage.token = data.token;
//     console.log('Verify loaded');
//   },
//   error: function(data) {    
//     console.log('Verify not loaded');
//   }
// });

// export const loadProfile = () => $.ajax({
//   type: 'POST',
//   url: URL + "/profile-get",
//   beforeSend: function(xhr) {
//     if(localStorage.token) {
//       xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
//     }
//   },
//   success: function(data) {
//     localStorage.token = data.token;
//     console.log('Profile loaded');
//   },
//   error: function(data) {    
//     console.log('Profile not loaded');
//   }
// });

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
