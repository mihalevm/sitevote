class TEmail:
    user_name: str
    site_url: str
    to: str


class TEmailConfirm(TEmail):
    confirm_hash: str

    def __init__(self, to: str, confirm_hash: str, user_name: str, site_url: str = None):
        self.confirm_hash = confirm_hash
        self.user_name = user_name
        self.site_url = site_url
        self.to = to


def render_email_confirm(params: TEmailConfirm) -> str:
    return f'''
<p>
    <span style="text-align: left; padding-right: 70%; font-size: 24px; font-weight: 600;">Голосование</span>
    <span style="text-align: right;">
        <a title="Вход в систему" href="{params.site_url}">
            Вход в систему
        </a>
    </span>
</p>
<hr/>
<p style="text-align: left;">Здравствуйте {params.user_name} !</p>
<p style="text-align: left;">Поздравляем с успешной регистрацией на <strong>сайте для голосования</strong> !</p>
<p style="text-align: left;">
    Что бы активировать Вашу учетную запись, нажмите кнопку ниже для подтверждения вашего адреса электронной почты.
</p>
<p>&nbsp;</p>
<p style="text-align: center;">
    <a style="background-color: #1cc1f7;
        color: white;
        text-decoration: none;
        padding: 10px;
        cursor: pointer;"
        title="Активировать учетную запись" href="{params.site_url+'/confirm.html?h='+params.confirm_hash}">
        Активировать учетную запись
    </a>
</p>
<p>&nbsp;</p>
<p style="text-align: left;">Если кнопка не работает скопируйте ссылку ниже в Ваш браузер:</p>
<p style="text-align: center; color: blue;">{params.site_url+'/confirm.html?h='+params.confirm_hash}</p>
<p>&nbsp;</p>
<p style="text-align: left;">
    Для получения дополнительной информации обратитесь в наш
    <a title="Центр поддержки." href="{params.site_url}">Центр поддержки.</a>
</p>
'''

