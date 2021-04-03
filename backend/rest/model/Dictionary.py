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


class Config(PrefixBase):
    __table_name__ = "config"

    id = Column(INTEGER(11), primary_key=True, autoincrement=True, comment="Уникальный идентификатор")
    key = Column(VARCHAR(32), nullable=False, comment="Ключ поля")
    value = Column(VARCHAR(16), nullable=True, comment="Значение поля")

    def __init__(self):
        __table__ = metadata.tables[self.__tablename__]


class VoteType(PrefixBase):
    __table_name__ = "vote_type"

    id = Column(INTEGER(11), primary_key=True, autoincrement=True, comment="Уникальный идентификатор")
    value = Column(VARCHAR(16), nullable=True, comment="Значение поля")

    def __init__(self):
        __table__ = metadata.tables[self.__tablename__]


# class VoteConfirm(PrefixBase):
#     __table_name__ = "vote_confirm"
#
#     id = Column(INTEGER(11), primary_key=True, autoincrement=True, comment="Уникальный идентификатор")
#     key = Column(VARCHAR(32), nullable=False, comment="Ключ поля")
#     value = Column(VARCHAR(16), nullable=True, comment="Значение поля")
#
#     def __init__(self):
#         __table__ = metadata.tables[self.__tablename__]

