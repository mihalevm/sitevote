import config from '../../config/config.json';

export const emailValidationEvent = (emailEl, saveBtnEl, invalidDiv) => {
  const isValidEmail = (email) => {
    const emailReg = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/;
    return emailReg.test(email);
  };

  const value = $(emailEl).val();
  const valid = isValidEmail(value);
  if(value.length != 0) {
    if(valid) {
      $(emailEl).removeClass('is-invalid');
      $(saveBtnEl).removeAttr('disabled');
    } else {
      $(invalidDiv).text(config.validationMessages.email.format_err);
      $(emailEl).addClass('is-invalid');
    }
  } else {
    $(invalidDiv).text(config.validationMessages.email.email_empty_err);
    $(emailEl).addClass('is-invalid');
    $(saveBtnEl).attr('disabled', true);
  }
};

export const passwordValidationEvent = (passEl, saveBtnEl, invalidDiv) => {
  const value = $(passEl).val();

  if(value.length != 0) {
    $(passEl).removeClass('is-invalid');
    $(saveBtnEl).removeAttr('disabled');    
  } else {
    $(invalidDiv).text(config.validationMessages.password.password_empty_err);
    $(passEl).addClass('is-invalid');
    $(saveBtnEl).attr('disabled', true);
  }
};

export const fieldLengthEvent = (fieldEl, btnEl, invalidDiv, len = 200) => {
  if($(fieldEl).val().length <= len) {
    $(fieldEl).removeClass('is-invalid');
    $(btnEl).removeAttr('disabled');
  } else {
    $(invalidDiv).text(config.validationMessages.field.limit_over_err);
    $(fieldEl).addClass('is-invalid');
    $(btnEl).attr('disabled', true);
  }
};

export const changeMainBlock = (rClass, aClass, text, url, rTime) => {
  setTimeout(() => {
    $('.alert').removeClass(rClass);
    $('.alert').addClass(aClass);
    $('.alert').text(text);        
    setTimeout(() => window.location.replace(url), rTime);
  }, 2000);
};

export const alertMsg = (id, cl, text) => `
<div id="${id}-alert-msg" class="alert alert-${cl}" role="alert">
  ${text}
</div>
`; 
