#
# Add new user
# insert into sv_users (email, password, fullname) VALUES ('user', sha2('user', 256), 'Client account');

import json
import logging

from sqlalchemy import create_engine, asc, desc
from sqlalchemy.pool import QueuePool
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from fastapi import Depends, FastAPI, HTTPException, status, Query
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from datetime import datetime, timedelta, date
from typing import Optional, List

from rest.lib.config import Configuration

from rest.model.Users import Users

from pydantic import BaseModel
from jose import JWTError, jwt

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


class Token(BaseModel):
    token: str
    type: str


class SessionAccount(BaseModel):
    token: str


class FilterParams(BaseModel):
    order_by: Optional[str] = Query(None)
    order: Optional[str] = Query(None)
    city_id: Optional[List[int]] = Query(None)
    rows: int = Query(20)
    page: int = Query(1)
    product_id: Optional[List[int]] = Query(None)
    service_id: Optional[List[int]] = Query(None)
    service_type_id: Optional[List[int]] = Query(None)
    sale_channel_id: Optional[List[int]] = Query(None)
    change_reason_id: Optional[List[int]] = Query(None)
    create_date_begin: date = Query(None)
    create_date_end: date = Query(None)
    change_date_begin: Optional[date] = Query(None)
    change_date_end: Optional[date] = Query(None)


config: Configuration = Configuration('server.ini')
DB_ACCOUNT = config.get_section('DATABASE')
ROUTER = config.get_section('ROUTER')

ACCESS_TOKEN_EXPIRE_MINUTES = int(ROUTER['token_expire'])
SECRET_KEY = ROUTER['secret']
ALGORITHM = ROUTER['algorithm']
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = FastAPI()
log = logging.getLogger("main")
DBH = None


def get_web_user(email: str) -> Users:
    return DBH.query(Users)\
            .filter(Users.email == email).first() if email else None


# def get_db_city_dic() -> ma_city:
#     return DBH.query(ma_city).filter(ma_city.key != 0).all() if DBH else None


# def get_db_ma_aa_b2c(filter_params: FilterParams) -> ma_aa_b2c:
#     result: ma_aa_b2c = ma_aa_b2c()
#
#     if DBH:
#         q = DBH.query(ma_aa_b2c.for_date, ma_city.name, ma_product.name, ma_aa_b2c.change_date, ma_aa_b2c.cnt) \
#             .filter(ma_aa_b2c.city_id == ma_city.key, ma_aa_b2c.product_id == ma_product.key)
#
#         if filter_params.product_id:
#             q = q.filter(ma_product.key.in_(','.join(str(i) for i in filter_params.product_id)))
#
#         if filter_params.city_id:
#             for i in filter_params.city_id:
#                 q = q.filter(ma_aa_b2c.city_id == str(i))
#
#         if filter_params.create_date_begin:
#             q = q.filter(ma_aa_b2c.for_date >= filter_params.create_date_begin)
#
#         if filter_params.create_date_end:
#             q = q.filter(ma_aa_b2c.for_date <= filter_params.create_date_end)
#
#         if filter_params.change_date_begin:
#             q = q.filter(ma_aa_b2c.change_date >= filter_params.change_date_begin)
#
#         if filter_params.change_date_end:
#             q = q.filter(ma_aa_b2c.change_date <= filter_params.change_date_end)
#
#         if filter_params.order_by and filter_params.order:
#             if filter_params.order == 'asc':
#                 q = q.order_by(asc(filter_params.order_by))
#             if filter_params.order == 'desc':
#                 q = q.order_by(desc(filter_params.order_by))
#
#         result = q.all()
#
#     return result


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


async def validate_user(token: str = Depends(oauth2_scheme)) -> str:

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
    account: Users = get_web_user(email)

    if account:
        new_token = create_access_token(
            data={"sub": account.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        ) if current_timestamp + timedelta(minutes=5) > session_timestamp \
            else token

    if new_token is None:
        raise credentials_exception

    return new_token


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
                           pool_recycle=5,
                           poolclass=QueuePool,
                           connect_args={'connect_timeout': 5}
                           )
    try:
        engine.connect()
    except SQLAlchemyError as exc:
        log.error('[Rest service] External DB connection error: %s', exc)
    else:
        base = declarative_base()
        base.metadata.bind = engine
        db_session = sessionmaker(bind=engine, autoflush=True, autocommit=False)
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


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    email:Users = Users()

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


@router.get("/authtest")
async def some_req(token: str = Depends(validate_user)):
    j_obj = {"token": token}

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': token
        }
    )


# @router.get("/get-city-dictionary")
# async def get_city_dictionary(sess_acc: SessionAccount = Depends(validate_user)):
#     j_obj = {
#         "data": json.dumps(get_db_city_dic(), cls=Encoder),
#         "token": sess_acc.token
#     }
#
#     return JSONResponse(
#         content=j_obj,
#         headers={
#             'x-auth-token': sess_acc.token
#         }
#     )
#

@router.post("/get-data")
async def get_data(params: FilterParams, sess_acc: SessionAccount = Depends(validate_user)):
    j_obj = {
        "data": json.dumps({"field1" : "Some data", "field2" : "Some data"}, cls=Encoder),
        "token": sess_acc.token
    }

    return JSONResponse(
        content=j_obj,
        headers={
            'x-auth-token': sess_acc.token
        }
    )

__all__ = ['router']
