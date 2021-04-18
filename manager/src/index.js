"use strict";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import sha256 from 'crypto-js/sha256'
import { Modal, Toast } from 'bootstrap';

let jwt = {token: '',};
let baseUrl = 'http://127.0.0.1:5656/';

function authorization(login, password, onDocumentReady) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
            let content = null;
            try {
                content = JSON.parse(this.responseText);
                jwt.token = content.token
            } catch (e) {
                console.log(e)
            } finally {
                if (onDocumentReady)
                    onDocumentReady(jwt.token);
            }
        }
    }

    let auth_params = new FormData();
    auth_params.append('username', login);
    auth_params.append('password', sha256(password));

    httpRequest.open('POST', baseUrl + 'login');
    httpRequest.send(auth_params);
}

function dataContentLoader (method, resource, params, onDocumentReady = null) {
    let httpReq = new XMLHttpRequest();

    httpReq.onreadystatechange = function () {
        if (this.readyState === 4) {
            let content = null;
            try {
                content = JSON.parse(this.responseText);
            } catch (e) {
                console.log(e)
            } finally {
                if (null !== content && content.hasOwnProperty('token')) {
                    if (onDocumentReady) {
                        onDocumentReady(content.error === 200 ? JSON.parse(content.data):[]);
                    }
                }
            }
        }
    }
    let req_get_params  = '?';

    Object.entries(params).forEach((k) => {
        req_get_params += k[0]+'='+k[1]+'&';
    });

    req_get_params  = method === 'GET' ? req_get_params.slice(0, -1) : '';

    httpReq.open(method, baseUrl+resource+req_get_params);
    httpReq.setRequestHeader('Authorization', 'Bearer ' + jwt.token);
    httpReq.send(JSON.stringify(params));
}

let timerId = null;

function newSearch(search_string) {
    if (search_string) {
        if (timerId)
            clearTimeout(timerId)

        timerId = setTimeout(() => {
            dataContentLoader(
                'POST',
                'user-search',
                {pattern: search_string},
                function (data) {
                    tableRender(data);
            })
        }, 1000)
    }
}

function sendValidation (uid) {
    dataContentLoader('POST', 'send-validation', {uid: uid}, function (send_result) {
         if (send_result)
             document.body.dispatchEvent(new  Event('SendSuccessful'))
        else
             document.body.dispatchEvent(new  Event('SendError'));
    })
}

function tableRender(data) {
    let t_body = document.querySelector('#searchResult > tbody');
    t_body.innerHTML = '';
    if (data.length) {
        Object.entries(data).forEach((i) => {
            let tr = document.createElement('tr');
            tr.innerHTML = '<th scope="row">' + i[1].id + '</th><td>' + i[1].fullname + '</td><td>'
                + i[1].email+'</td><td>' + i[1].phone
                + '</td><td title="Отправить приглашение" alt="Отправить приглашение" class="send-validation"><i class="bi-envelope"></i></td>';
            tr.dataset.uid = i[1].id;
            t_body.appendChild(tr);
        })
        t_body.querySelector('.send-validation').addEventListener('click', (e) => {
            e.stopPropagation();
            sendValidation(e.target.parentElement.parentElement.dataset.uid);
        })
    } else {
        t_body.innerHTML = '<tr><td class="text-center" colspan="4">По Вашему запросу ни чего не найдено</td></tr>';
    }
}

function initSaveForm(el, is_new_user = true) {
    let email = el.querySelector('#email');
    let full_name = el.querySelector('#full_name');
    let phone = el.querySelector('#phone');
    let user_desc = el.querySelector('#user_desc');

    email.classList.remove('is-invalid');
    full_name.classList.remove('is-invalid');

    if (is_new_user) {
        email.value = '';
        full_name.value = '';
        phone.value = '';
        user_desc.value = '';
    }

    email.focus();
}

function saveUser(el) {
    let params = {};
    let uid = el.dataset.uid;
    let email = el.querySelector('#email');
    let full_name = el.querySelector('#full_name');
    let phone = el.querySelector('#phone');
    let user_desc = el.querySelector('#user_desc');

    if (!email.value)
        email.classList.add('is-invalid');
    if (!full_name.value)
        full_name.classList.add('is-invalid');

    if (!email.value || !full_name.value)
        return false;

    params.email = email.value;
    params.fullname = full_name.value;

    if (uid)
        params.uid = uid;
    if (phone.value)
        params.phone = phone.value;
    if (user_desc.value)
        params.user_desc = user_desc.value;

    dataContentLoader('POST','user-save', params)

    return true;
}

function act_login(el_loginModal, loginModal) {
    let login    = el_loginModal.querySelector('#account_login');
    let password = el_loginModal.querySelector('#account_password');
    let status   = el_loginModal.querySelector('#account_status');

    login.classList.remove('is-invalid');
    password.classList.remove('is-invalid');

    if (!login.value)
        login.classList.add('is-invalid');

    if (!password.value)
        password.classList.add('is-invalid');

    if (!login.value || !password.value)
        return

    authorization(login.value, password.value, function (r){
        if (r)
            loginModal.hide()
        else
            status.innerHTML = 'Ошибка авторизации'
    });
}

function getUserProfile(uid, el, modal) {
    let email = el.querySelector('#email');
    let full_name = el.querySelector('#full_name');
    let phone = el.querySelector('#phone');
    let user_desc = el.querySelector('#user_desc');

    dataContentLoader('POST', 'get-user', {uid: uid}, function (profile) {
        email.value = profile.email;
        full_name.value = profile.fullname;
        phone.value = profile.phone;
        user_desc.value = profile.user_desc;
        el.dataset.uid = uid;

        modal.show();
    })
}

document.addEventListener('DOMContentLoaded', () => {
    let el_addUserModal = document.querySelector('#addUser');
    let el_loginModal = document.querySelector('#loginModal');
    let el_searchInput = document.querySelector('#search');
    let sendSuccessfulToast = new  Toast(document.querySelector('#send-successful'));
    let sendErrorToast = new Toast(document.querySelector('#send-error'));

    let addUserModal = new Modal(el_addUserModal);
    let loginModal = new Modal(el_loginModal, {
        keyboard: false,
        backdrop: 'static'
    });

    loginModal.show();

    document.querySelector('#act_login').addEventListener('click', () => {
        act_login(el_loginModal, loginModal);
    })

    el_loginModal.querySelector('#account_password').addEventListener('keydown', (e) => {
        if (e.key && e.key.toLowerCase() === 'enter')
            act_login(el_loginModal, loginModal);
    })

    el_searchInput.addEventListener('keyup', (e) => {
        newSearch(e.target.value);
    })

    el_addUserModal.addEventListener('show.bs.modal', (e) => {
        initSaveForm(el_addUserModal, parseInt(e.target.dataset.uid) === 0);
    });

    el_addUserModal.addEventListener('hide.bs.modal', () => {
        el_searchInput.dispatchEvent(new KeyboardEvent('keyup', {'key': 27}))
    });

    document.querySelector('#bnt_AddUser').addEventListener('click', () => {
        el_addUserModal.dataset.uid = '0'   ;
        addUserModal.show();
    })

    document.querySelector('#searchResult > tbody').addEventListener('click', (e) => {
        getUserProfile(e.target.parentElement.dataset.uid, el_addUserModal, addUserModal)
    })

    document.querySelector('#saveUser').addEventListener('click', () => {
        if (saveUser(el_addUserModal))
            addUserModal.hide();
    })

    document.body.addEventListener('SendSuccessful', () => {
        sendSuccessfulToast.show();
    })

    document.body.addEventListener('SendError', () => {
        sendErrorToast.show();
    })
})
