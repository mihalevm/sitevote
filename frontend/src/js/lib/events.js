import config from '../../config/config.json'
// Input -> Objects ids
export const emailValidationEvent = (emailEl, saveBtnEl, invalidDiv) => {
  const isValidEmail = (email) => {
    const emailReg = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){1}\.[a-z]{2,3}$/gm;
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
