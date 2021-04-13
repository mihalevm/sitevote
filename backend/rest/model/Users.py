from sqlalchemy import CHAR, Column, text
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base, declared_attr


Base = declarative_base()
metadata = Base.metadata


class PrefixBase(Base):
    __abstract__ = True
    __tbl_prefix__ = 'sv_'

    @declared_attr
    def __tablename__(self):
        return self.__tbl_prefix__ + self.__table_name__


class Users(PrefixBase):
    __table_name__ = "users"

    id = Column(INTEGER(11), primary_key=True, autoincrement=True, comment="Уникальный идентификатор пользователя")
    email = Column(VARCHAR(32), nullable=False, comment="Эл почта пользователя и логин")
    password = Column(VARCHAR(64), nullable=False, comment="Пароль пользователя")
    fullname = Column(VARCHAR(64), nullable=True, comment="ФИО пользователя")
    phone = Column(VARCHAR(16), nullable=True, comment="Номер телефона")
    user_desc = Column(VARCHAR(512), nullable=True, comment="Краткое описание")
    disabled = Column(CHAR(1), default=text('N'), comment="Признак блокировки аккаунта")
    verified = Column(CHAR(1), default=text('N'), comment="Признак верификации аккаунта")
    chash = Column(VARCHAR(64), nullable=True, comment="Хеш подтверждения аккаунта")
    create_date = Column(TIMESTAMP, nullable=False, default=func.now(), comment="Дата создания аккаунта")

    def __init__(self):
        __table__ = metadata.tables[self.__tablename__]
