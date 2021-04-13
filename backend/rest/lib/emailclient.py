import logging

from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from rest.lib.config import Configuration
from rest.lib.emailtemplates import TEmailConfirm, render_email_confirm


def __send_email(to: str, subj: str, msg: str) -> bool:
    log = logging.getLogger("main")
    config: Configuration = Configuration('server.ini')
    email_config = config.get_section('EMAIL')
    result: bool = True

    mail_message: MIMEMultipart = MIMEMultipart('alternative')
    mail_message.set_charset('utf-8')

    mail_message['Subject'] = subj
    mail_message['From'] = email_config['from']
    mail_message['To'] = to
    mail_message.add_header('Content-Type', 'text/html')
    mail_message.attach(MIMEText(msg, 'html'))
    mail_message.attach(MIMEText('', 'plain'))

    mail_session: SMTP = SMTP(email_config['host'])
    mail_session.starttls()
    mail_session.login(email_config['from'], email_config['password'])

    try:
        mail_session.sendmail(
            email_config['from'],
            to,
            mail_message.as_string()
        )
    except Exception as exc:
        result=False
        log.error('[EMAIL CLIENT] error %s', exc)
    finally:
        mail_session.quit()

    return result


def send_confirmation(params: TEmailConfirm):
    return __send_email(
        params.to,
        'Уведомление о подтверждении учетной записи на сайте голосования',
        render_email_confirm(params)
    )
