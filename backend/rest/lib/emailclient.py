import logging

from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from html2text import html2text

from rest.lib.config import Configuration
from rest.lib.emailtemplates import TEmailConfirm, render_email_confirm,\
                                    TEmailVoteConfirm, render_vote_email_confirm,\
                                    TEmailSupport, render_email_support


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
    mail_message.add_header('reply-to', email_config['replyto'])
    mail_message.add_header('Content-Type', 'text/html')
    mail_message.attach(MIMEText(msg, 'html'))
    mail_message.attach(MIMEText(html2text(msg), 'plain'))

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


def send_vote_confirmation(params: TEmailVoteConfirm):
    return __send_email(
        params.to,
        'Подверждение голоса',
        render_vote_email_confirm(params)
    )


def send_support_ticket(params: TEmailSupport):
    return __send_email(
        params.to,
        'Вопрос с сайта',
        render_email_support(params)
    )
