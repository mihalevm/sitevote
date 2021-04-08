import sha256 from 'crypto-js/sha256';

const URL = 'http://sitevote.e-arbitrage.ru/rest';

export const checkAuth = () => $.ajax({
  type: 'GET',
  url: URL + "/authtest",
  beforeSend: function(xhr) {
    if(localStorage.token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
    }
  },
  success: function(data) {
    localStorage.token = data.token;        
    console.log(data.token + ' You have successfully accessed to ' + window.location.pathname);
  },
  error: function(data) {    
    if(window.location.pathname !== '/') {
      window.location.replace('/');
    }
  }
});

export const loadProfile = () => $.ajax({
  type: 'POST',
  url: URL + "/profile-get",
  beforeSend: function(xhr) {
    if(localStorage.token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
    }
  },
  success: function(data) {
    localStorage.token = data.token;
    console.log('Profile loaded');
  },
  error: function(data) {    
    console.log('Profile not loaded');
  }
});

export const updateProfile = ({email, password, fullname, phone, user_desc}) => $.ajax({
  type: 'POST',
  url: URL + "/profile-save",
  beforeSend: function(xhr) {
    if(localStorage.token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
    }
  },  
  data: JSON.stringify({
    email: email,
    password: sha256(password).toString(),
    fullname: fullname,
    phone: phone,
    user_desc: user_desc
  }),
  success: function(data) {
    localStorage.token = data.token;    
    console.log('User updated')
  },
  error: function(data) {    
    console.log('User not updated')
  }
});


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
  

// const checkOpenAuth = () => {
//   this.__httpRequest.onreadystatechange = function() {
//     if (this.readyState === 4) {
//       if (this.status === 200) {
//           let token = JSON.parse(this.responseText);
//           if (token.hasOwnProperty('token')) {
//             _this.setCookie(_this.auth_token_name, token.token );
//             _this.__MnuUsername.innerText = _this.getCookie(_this.auth_user_name);
//             _this.__ContentController.dashboard_state();
//           }
//       } else {
//         _this.deleteCookie(_this.auth_token_name);
//         _this.__ContentController.login_state();
//       }
//     }
//   };
// };

// const authEmailPassword = () => {
//   this.__httpRequest.onreadystatechange = function() {
//     if (this.readyState === 4) {
//       if (this.status === 200) {
//           let token = JSON.parse(this.responseText);
//           if (token.hasOwnProperty('token')) {
//             _this.setCookie(_this.auth_token_name, token.token );
//             _this.__MnuUsername.innerText = _this.getCookie(_this.auth_user_name);
//             _this.__ContentController.dashboard_state();
//           }
//       } else {
//         _this.deleteCookie(_this.auth_token_name);
//         _this.__ContentController.login_state();
//       }
//     }
//   };
// };

// const reqContent = () => {
//   let httpReq = new XMLHttpRequest();
//   let CommonHelpersInstance = new CommonHelpers();

//   httpReq.onreadystatechange = function () {
//   if (this.readyState === 4) {

//     CommonHelpersInstance.systemNotice.hide();
//   let content = null;
//   try {
//     content = JSON.parse(this.responseText);
//   } catch(e) {
//     console.log(e)
//   } finally {
//     if (null !== content && content.hasOwnProperty('token')) {
//       CommonHelpersInstance.setCookie(CommonHelpersInstance.auth_token_name, content.token);
//       if (onDocumentReady) {
//         let pages = content.hasOwnProperty('pages') ? content.pages : null;
//         onDocumentReady(content.data, pages);
//       }
//     } else {
//       CommonHelpersInstance.deleteCookie(CommonHelpersInstance.auth_token_name);
//       document.body.dispatchEvent(new Event('LogoutEvent'));
//     }
//   }
//   }
//   }

//   let req_get_params  = '?';
//   Object.entries(params).forEach((k) => {
//     // req_post_params.append(k[0], k[1]);
//     req_get_params += k[0]+'='+k[1]+'&';
//   });
//   req_get_params  = method === 'GET' ? req_get_params.slice(0, -1) : '';
//   httpReq.open(method, CommonHelpersInstance.baseUrl+resource+req_get_params);
//   //TODO: Replace to constructor part for test
//   httpReq.setRequestHeader('Authorization', 'Bearer ' + CommonHelpersInstance.getCookie(CommonHelpersInstance.auth_token_name));
//   CommonHelpersInstance.systemMessage('progress', 'Загрузка данных').systemNotice.show();
//   httpReq.send(JSON.stringify(params));
// };


// crossDomain: true,
//   headers: {'Access-Control-Allow-Origin': '*'},
//   contentType: 'application/x-www-form-urlencoded',
//   dataType: 'json',
