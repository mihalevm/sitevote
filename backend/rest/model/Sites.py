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


class Sites(PrefixBase):
    __table_name__ = "sites"

    id = Column(INTEGER(11), primary_key=True, autoincrement=True, comment="Уникальный идентификатор ресурса")
    uid = Column(INTEGER(11), nullable=False, comment="Уникальный идентификатор владельца сайта")
    site_url = Column(VARCHAR(128), nullable=True, unique=True, comment="Адрес сайта")
    site_desc = Column(VARCHAR(512), nullable=True, comment="Краткое описание")
    short_link = Column(VARCHAR(64), nullable=True, unique=True, comment="Короткая ссылка")
    img_link = Column(VARCHAR(64), nullable=True, comment="Ссылка на снимок экрана сайта")
    fast_rait = Column(INTEGER(11), default=0, comment="Рейтинг сайта")
    create_date = Column(TIMESTAMP, nullable=False, default=func.now(), comment="Дата создания аккаунта")
    disabled = Column(CHAR(1), default=text('N'), comment="Признак блокировки")
    verified = Column(CHAR(1), default=text('N'), comment="Признак верификации")

    def __init__(self):
        __table__ = metadata.tables[self.__tablename__]
