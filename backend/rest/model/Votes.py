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


class Votes(PrefixBase):
    __table_name__ = "votes"

    id = Column(INTEGER(11), primary_key=True, autoincrement=True, comment="Уникальный идентификатор")
    sid = Column(INTEGER(11), nullable=False, comment="Уникальный идентификатор ресурса")
    vote_type = Column(INTEGER(11), nullable=False, comment="Тип голоса из словаря")
    email = Column(VARCHAR(32), nullable=False, comment="Эл почта голосующего")
    phone = Column(VARCHAR(16), nullable=True, comment="Номер телефона голосующего")
    vote_date = Column(TIMESTAMP, nullable=False, default=func.now(), comment="Дата голосоания")

    def __init__(self):
        __table__ = metadata.tables[self.__tablename__]
