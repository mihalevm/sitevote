#
# Add new user
# insert into sv_users (email, password, fullname) VALUES ('user', sha2('user', 256), 'Client account');

import json
import logging

from secrets import token_hex

from sqlalchemy import create_engine, asc, desc, or_, func
from sqlalchemy.pool import QueuePool
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from fastapi import Depends, FastAPI, HTTPException, status, Query, Body
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime, timedelta, date
from typing import Optional, List

from rest.lib.config import Configuration
from rest.model.Users import Users
from rest.model.Sites import Sites
from rest.model.Votes import Votes
from rest.model.Dictionary import VoteType
from rest.lib.emailtemplates import TEmailConfirm
from rest.lib.emailclient import send_confirmation

from rest.lib.webscreen import WebScreen
from rest.lib.emailtemplates import TEmailVoteConfirm
from rest.lib.emailclient import send_vote_confirmation

from pydantic import BaseModel
from jose import JWTError, jwt
from PIL import Image


# Todo: remove modules for prod
# from pprint import pprint


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    json.dumps(data)
                    fields[field] = data
                except TypeError:
                    if type(data) is date or type(data) is datetime:
                        fields[field] = data.strftime("%d.%m.%Y %H:%M:%S")
                    else:
                        fields[field] = None
            return fields

        if type(obj) is date or type(obj) is datetime:
            return obj.strftime("%d.%m.%Y %H:%M:%S")
        else:
            return json.JSONEncoder.default(self, obj)


class SessionAccount(Users):
    token: str


class UserParams(BaseModel):
    uid: Optional[int] = Query(default=0, description='Идентификатор пользователя')
    email: str = Query(default=None, max_length=32, description='Эл. почта пользователя используемая в качестве логина')
    password: Optional[str] = Query(default=None, max_length=64, description='Пароль пользователя')
    fullname: Optional[str] = Query(default=None, max_length=128, description='ФИО либо название компании')
    phone: Optional[str] = Query(default=None, max_length=12, description='Контактный телефон')
    user_desc: Optional[str] = Query(default=None, max_length=512, description='Краткое описание пользователя')


class SiteParams(BaseModel):
    sid: Optional[int] = Query(default=None, description='никальный идетнификатор сайта')
    site_desc: Optional[str] = Query(default=None, max_length=512, description='Краткое описание сайта')
    site_url: str = Query(default=None, max_length=128, description='Адрес сайта')
    short_link: Optional[str] = Query(default=None, max_length=32, description='Сокращенная ссылка сайта')
    img_link: Optional[str] = Query(default=None, max_length=64, description='Базовое имя картинки')
    disabled: Optional[str] = Query(default=None, max_length=1, description='Признак блокировки сайта')


class SiteVerifyParams(BaseModel):
    url: str = Query(default=None, description="Ссылка на сайт")


class SiteGetParams(BaseModel):
    sid: int = Query(default=None, description="Идентификатор сайта")


class SiteSearchParams(BaseModel):
    pattern: str = Query(default=None, description="Паттерн поиска сайта")


class SiteTopParams(BaseModel):
    top: int = Query(default=None, gt=0, le=10,  description="Колличество лидирующих сайтов")


class AccountConfirmParams(BaseModel):
    confirm_hash: str = Query(default=None, max_length=64, description="Строка-хеш подтверждения")


class VoteConfirmParams(BaseModel):
    sid: int = Query(default=None, description="Идентификатор сайта")
    vtype: int = Query(default=None, description="Тип голосующего")
    email: str = Query(default=None, max_length=64, description="Эл. адрес голосующего")


class UserSearchParams(BaseModel):
    pattern: str = Query(default=None, description="Паттерн поиска пользователей")


class GetUserParams(BaseModel):
    uid: int = Query(default=None, description="Идентификатор пользователя")


config: Configuration = Configuration('server.ini')
DB_ACCOUNT = config.get_section('DATABASE')
ROUTER = config.get_section('ROUTER')
REST = config.get_section('REST')

ACCESS_TOKEN_EXPIRE_MINUTES = int(ROUTER['token_expire'])
SECRET_KEY = ROUTER['secret']
ALGORITHM = ROUTER['algorithm']
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = FastAPI()
log = logging.getLogger("main")
DBH = None


router.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_web_user(email: str) -> Users:
    account: Users = Users()

    try:
        account = DBH.query(Users) \
            .filter(Users.email == email).first() if email else None
    except SQLAlchemyError as exc:
        log.error('[Rest] DB connection error: %s', exc)
        DBH.rollback()

    return account


def db_profile_save(uid: int, profile: UserParams) -> bool:
    result = False

    user_profile: Users = DBH.query(Users) \
        .filter(Users.id == uid).first()

    user_profile.email = profile.email

    if profile.password:
        user_profile.password = profile.password

    if profile.fullname:
        user_profile.fullname = profile.fullname

    if profile.phone:
        user_profile.phone = profile.phone

    if profile.user_desc:
        user_profile.user_desc = profile.user_desc

    try:
        DBH.commit()
    except SQLAlchemyError as exc:
        log.error('[REST] Profile save error: %s', exc)
    else:
        result = True

    return result


def db_profile_get(uid: int) -> Users:
    return DBH.query(Users) \
        .filter(Users.id == uid).first()


def db_site_save(uid: int, site_params: SiteParams) -> bool:
    site: Site = Sites()
    result: bool = False

    if site_params.sid:
        site = DBH.query(Sites).filter(Sites.id == site_params.sid).first()

    if site_params.site_desc:
        site.site_desc = site_params.site_desc

    if site_params.short_link:
        site.short_link = site_params.short_link

    if site_params.img_link:
        site.img_link = site_params.img_link

    if site_params.site_url:
        if not site_params.site_url.lower().startswith('http'):
            site_params.site_url = 'http://' + site_params.site_url
        site.site_url = site_params.site_url

    if site_params.disabled:
        site.disabled = site_params.disabled

    try:
        if not site_params.sid:
            site.uid = uid
            site.disabled = 'N'
            site.verified = 'N'
            DBH.add(site)
        DBH.commit()
    except SQLAlchemyError as exc:
        log.error('[REST] Site save error: %s', exc)
    else:
        result = True

    return result


def db_site_get(uid: int, sid: int) -> Sites:
    try:
        site_profile: Sites = DBH.query(Sites) \
            .filter(Sites.id == sid)

        if uid:
            site_profile = site_profile \
                .filter(Sites.uid == uid)
    except SQLAlchemyError as exc:
        DBH.rollback()
        site_profile = Sites()
        log.error('[Rest] DB error: %s', exc)

    return site_profile.first() if site_profile else None


def db_site_del(uid: int, sid: int) -> bool:
    result = False

    try:
        DBH.query(Sites) \
            .filter(Sites.id == sid, Sites.uid == uid)\
            .delete(synchronize_session=False)
        DBH.query(Votes) \
            .filter(Votes.sid == sid)\
            .delete(synchronize_session=False)
        DBH.commit()
    except SQLAlchemyError as exc:
        DBH.rollback()
        log.error('[REST] DB error: %s', exc)
    else:
        result = True

    return result


def db_site_stats(uid: int) -> Sites:
    return DBH.query(Sites) \
        .filter(Sites.uid == uid).order_by(asc(Sites.fast_rait)).all()


def db_site_search(uid: int, pattern: str) -> Sites:
    try:
        sites = DBH.query(Sites) \
            .filter(or_(func.lower(Sites.site_desc).ilike(f'%{pattern.lower()}%'),
                        func.lower(Sites.site_url).ilike(f'%{pattern.lower()}%')))\
            .filter(Sites.img_link.isnot(None))

        if uid:
            sites = sites.filter(Sites.uid == uid)
    except SQLAlchemyError as exc:
        DBH.rollback()
        sites = None
        log.error('[Rest] DB error: %s', exc)

    return sites.all() if sites else None


def db_vote_type() -> VoteType:
    try:
        vote_type: VoteType = DBH.query(VoteType).all()
    except SQLAlchemyError as exc:
        DBH.rollback()
        vote_type = VoteType()
        log.error('[Rest] DB connection error: %s', exc)

    return vote_type


def db_site_top() -> Sites:
    try:
        sites: Sites = DBH.query(Sites).filter(Sites.disabled == 'N').order_by(desc(Sites.fast_rait)).all()
    except SQLAlchemyError as exc:
        DBH.rollback()
        sites = Sites()
        log.error('[Rest] DB connection error: %s', exc)

    return sites


def db_confirm_account(chash: str) -> Users:
    try:
        user: Users = DBH.query(Users).filter(Users.chash == chash).first()
        if user:
            user.chash = ''
            user.verified = 'Y'
            DBH.commit()
    except SQLAlchemyError as exc:
        DBH.rollback()
        user = Users()
        log.error('[Rest] DB connection error: %s', exc)

    return user


def db_vote_confirm_email_add(params: VoteConfirmParams) -> str:
    chash: str = ''

    has_vote: Votes = DBH.query(Votes)\
        .filter(Votes.email == params.email, Votes.vote_date+86400 > func.now())\
        .first()

    if not has_vote:
        chash: str = token_hex(32)
        vote: Votes = Votes()
        vote.email = params.email
        vote.sid = params.sid
        vote.vote_type = params.vtype
        vote.chash = chash
        DBH.add(vote)
        DBH.commit()

    return chash


def db_vote_confirm_email(chash) -> bool:
    result: bool = False

    vote: Votes = DBH.query(Votes)\
        .filter(Votes.chash == chash)\
        .first()

    if vote:
        vote.chash = None
        vote_weight = DBH.query(VoteType.weight)\
            .filter(VoteType.id == vote.vote_type)\
            .first()

        site: Sites = DBH.query(Sites)\
            .filter(Sites.id == vote.sid)\
            .first()

        if vote_weight and site:
            site.fast_rait = site.fast_rait + vote_weight[0]
            result = True

        DBH.commit()

    return result


def db_save_user(user: UserParams) -> bool:
    result = True

    if user.uid > 0:
        db_user: Users = DBH.query(Users)\
            .filter(Users.id == user.uid)\
            .first()
        db_user.email = user.email
        db_user.fullname = user.fullname
        db_user.phone = db_user.phone
        db_user.user_desc = user.user_desc
        DBH.commit()
    else:
        db_user: Users = Users()
        db_user.email = user.email
        db_user.fullname = user.fullname
        db_user.phone = db_user.phone
        db_user.user_desc = user.user_desc
        db_user.password = token_hex(32)
        db_user.disabled = 'N'
        db_user.verified = 'N'

        DBH.add(db_user)
        DBH.commit()

    return result


def db_search_user(pattern: str) -> Users:
    try:
        users = DBH.query(Users) \
            .filter(or_(func.lower(Users.email).ilike(f'%{pattern.lower()}%'),
                        func.lower(Users.fullname).ilike(f'%{pattern.lower()}%'),
                        func.lower(Users.user_desc).ilike(f'%{pattern.lower()}%'),
                        func.lower(Users.phone).ilike(f'%{pattern.lower()}%')))
    except SQLAlchemyError as exc:
        DBH.rollback()
        users = None
        log.error('[Rest] DB error: %s', exc)

    return users.all() if users else None


def authenticate_user(email: str, password: str) -> Users:
    user_account = get_web_user(email)

    return user_account if hasattr(user_account, 'password') and password == user_account.password else None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


async def validate_user(token: str = Depends(oauth2_scheme)) -> SessionAccount:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        session_timestamp = datetime.fromtimestamp(payload.get("exp"))
        current_timestamp = datetime.utcnow()

        if email is None:
            credentials_exception.detail = "Token without user"
            raise credentials_exception

        if current_timestamp > session_timestamp:
            credentials_exception.detail = "Session timeout"
            raise credentials_exception

    except JWTError:
        credentials_exception.detail = "JWT error decode"
        raise credentials_exception

    new_token = None
    account: SessionAccount = get_web_user(email)

    if account:
        new_token = create_access_token(
            data={"sub": account.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        ) if current_timestamp + timedelta(minutes=5) > session_timestamp \
            else token

    if new_token is None:
        raise credentials_exception

    account.token = new_token

    return account


@router.on_event("startup")
async def startup():
    engine = create_engine(f"mysql://"
                           f"{DB_ACCOUNT['username']}:"
                           f"{DB_ACCOUNT['password']}@"
                           f"{DB_ACCOUNT['host']}/"
                           f"{DB_ACCOUNT['dbname']}?"
                           f"charset=utf8&binary_prefix=true",
                           pool_size=5,
                           max_overflow=5,
                           pool_timeout=5,
                           pool_recycle=3600,
                           pool_pre_ping=True,
                           poolclass=QueuePool,
                           connect_args={'connect_timeout': 5},
                           isolation_level="READ UNCOMMITTED"
                           )
    try:
        engine.connect()
    except SQLAlchemyError as exc:
        log.error('[Rest] External DB connection error: %s', exc)
    else:
        base = declarative_base()
        base.metadata.bind = engine
        db_session = sessionmaker(
            bind=engine,
            autoflush=True,
            autocommit=False
        )
        global DBH
        DBH = db_session()


@router.on_event("shutdown")
async def shutdown():
    if DBH:
        DBH.close()


@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    return JSONResponse(
        content={},
        headers={
            'x-auth-token': token
        }
    )


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    email: Users = Users()

    if form_data.username is not None and form_data.password is not None:
        email = authenticate_user(form_data.username, form_data.password)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='User UNAUTHORIZED',
            headers={"WWW-Authenticate": "Bearer"},
        )

    if email.disabled == 'Y':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Inactive account',
            headers={"WWW-Authenticate": "Bearer"},
        )

    if email.verified == 'N':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Account not verified',
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        data={"sub": email.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return JSONResponse(
        content={'token': token, 'type': 'bearer'},
        headers={
            'x-auth-token': token
        }
    )


@router.post("/account-confirm")
async def account_confirm(chash: AccountConfirmParams):
    user: Users = db_confirm_account(chash.confirm_hash)
    token: str = ''
    error: int = 400

    if user:
        token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        error = 200

    return JSONResponse(
        content={
            'token': token,
            'type': 'bearer',
            'error': error
        },
        headers={
            'x-auth-token': token
        }
    )


@router.get("/authtest")
async def authorization_test(sess_acc: SessionAccount = Depends(validate_user)):
    return JSONResponse(
        content={
            "token": sess_acc.token
        },
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/profile-save")
async def profile_save(params: UserParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка сохранения профиля. Проверить уникальность адреса почты",
        "error": 400,
        "token": sess_acc.token
    }

    if db_profile_save(sess_acc.id, params):
        j_obj["data"] = "Профиль сохранен"
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/profile-get")
async def profile_get(sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка поиска профиля для аккаунта",
        "error": 400,
        "token": sess_acc.token
    }

    profile: Users = db_profile_get(sess_acc.id)

    if profile:
        j_obj["data"] = json.dumps(profile, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/site-verify")
async def site_verify(p: SiteVerifyParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "error": 200,
        "token": sess_acc.token
    }

    pic_name = token_hex(32)
    pic_large = pic_name + '.png'
    pic_small = pic_name + '_small' + '.png'
    web_screen: WebScreen = WebScreen(config)

    if not p.url.lower().startswith('http'):
        p.url = 'http://'+p.url

    if web_screen.take_screenshot(p.url, ROUTER['image_storage_dir'] + '/' + pic_large):
        pic = Image.open(ROUTER['image_storage_dir'] + '/' + pic_large)
        spic = pic.resize((480, 320))
        spic.save(ROUTER['image_storage_dir'] + '/' + pic_small)

        j_obj["data"] = {
            "origin": pic_name,
            "large": ROUTER['image_storage_web'] + '/' + pic_large,
            "small": ROUTER['image_storage_web'] + '/' + pic_small,
        }
    else:
        j_obj['data'] = 'Ошибка выполнения запроса'
        j_obj['error'] = 400

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/site-save")
async def site_save(params: SiteParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка сохранения параметров сайта.",
        "error": 400,
        "token": sess_acc.token
    }

    if db_site_save(sess_acc.id, params):
        j_obj["data"] = "Настройки сайта сохранены"
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/site-get")
async def site_get(params: SiteGetParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка поиска натроек сайта",
        "error": 400,
        "token": sess_acc.token
    }

    site: Sites = db_site_get(sess_acc.id, params.sid)

    if site:
        j_obj["data"] = json.dumps(site, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/site-del")
async def site_del(params: SiteGetParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка удаления сайта",
        "error": 400,
        "token": sess_acc.token
    }

    result: bool = db_site_del(sess_acc.id, params.sid)

    if result:
        j_obj["data"] = result
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/site-stats")
async def site_get(sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка поиска сайтов пользователя",
        "error": 400,
        "token": sess_acc.token
    }

    site: Sites = db_site_stats(sess_acc.id)

    if site:
        j_obj["data"] = json.dumps(site, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/site-profile-search")
async def site_profile_search(params: SiteSearchParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка поиска сайтов пользователя",
        "error": 400,
        "token": sess_acc.token
    }

    sites: Sites = db_site_search(sess_acc.id, params.pattern)

    if sites:
        j_obj["data"] = json.dumps(sites, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/site-search")
async def site_search(params: SiteSearchParams):
    j_obj = {
        "data": "Ошибка поиска сайтов пользователя",
        "error": 400,
    }

    sites: Sites = db_site_search(0, params.pattern)

    if sites:
        j_obj["data"] = json.dumps(sites, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
    )


@router.post("/site-vote-get")
async def site_get(params: SiteGetParams):
    j_obj = {
        "data": "Ошибка поиска натроек сайта",
        "error": 400,
    }

    site: Sites = db_site_get(0, params.sid)

    if site:
        j_obj["data"] = json.dumps(site, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
    )


@router.post("/vote-types")
async def vote_types():
    j_obj = {
        "data": "Ошибка запроса типа голоса",
        "error": 400,
    }

    vote_type: VoteType = db_vote_type()

    if vote_type:
        j_obj["data"] = json.dumps(vote_type, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
    )


@router.post("/site-top")
async def site_top(params: SiteTopParams):
    j_obj = {
        "data": "Ошибка запроса рейтинга сайтов",
        "error": 400,
    }

    sites: Sites = db_site_top()

    if sites:
        j_obj["data"] = json.dumps(sites[0:params.top], cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
    )


@router.post("/vote-email-send-confirm")
async def vote_email_send_confirm(params: VoteConfirmParams):
    j_obj = {
        "data": "Вы уже проголосовали. Следующее голосование для вас доступно через 24 часа.",
        "error": 400,
    }

    chash: str = db_vote_confirm_email_add(params)
    site: Sites = db_site_get(0, params.sid)

    if len(chash) and site:
        email_params: TEmailVoteConfirm = TEmailVoteConfirm(
            to=params.email,
            site_url=REST['site_url'],
            confirm_hash=chash,
            site_name=site.site_desc
        )

        if send_vote_confirmation(email_params):
            j_obj["data"] = True
            j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
    )


@router.post("/vote-email-confirm")
async def vote_email_confirm(params: AccountConfirmParams):
    j_obj = {
        "data": "Ошибка подтверждения вашего голоса. Попробуйте проголосовать заново.",
        "error": 400,
    }

    result: bool = db_vote_confirm_email(params.confirm_hash)

    if result:
        j_obj["data"] = result
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
    )


@router.post("/user-save")
async def save_user(params: UserParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка сохранения пользователя",
        "error": 400,
        "token": sess_acc.token
    }

    result: bool = db_save_user(params)

    if result:
        j_obj["data"] = result
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/user-search")
async def save_user(params: UserSearchParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка поиска пользователя",
        "error": 400,
        "token": sess_acc.token
    }

    users: Users = db_search_user(params.pattern)

    if users:
        j_obj["data"] = json.dumps(users, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/get-user")
async def get_user(params: GetUserParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка запроса пользователя",
        "error": 400,
        "token": sess_acc.token
    }

    profile: Users = db_profile_get(params.uid)

    if profile:
        j_obj["data"] = json.dumps(profile, cls=Encoder)
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


@router.post("/send-validation")
async def send_validation(params: GetUserParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": "Ошибка запроса пользователя",
        "error": 400,
        "token": sess_acc.token
    }

    profile: Users = db_profile_get(params.uid)
    confirm_hash: str = token_hex(32)

    confirmation: TEmailConfirm = TEmailConfirm(
                confirm_hash=confirm_hash,
                user_name=profile.fullname,
                to=profile.email,
                site_url=REST['site_url']
            )

    if send_confirmation(confirmation):
        profile.verified = 'S'
        profile.chash = confirm_hash
        DBH.commit()
        j_obj["data"] = True
        j_obj["error"] = 200
    else:
        j_obj["data"] = False
        j_obj["error"] = 200

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )


__all__ = ['router']
