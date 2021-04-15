import os

from sqlalchemy import create_engine, func
from sqlalchemy.pool import QueuePool
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from rest.lib.config import Configuration
from rest.model.Votes import Votes


if __name__ == "__main__":
    config: Configuration = Configuration(os.path.dirname(os.path.abspath(__file__))+'/server.ini')
    db_config = config.get_section('DATABASE')
    rest_config = config.get_section('REST')
    DBH = None

    engine = create_engine(f"mysql://"
                           f"{db_config['username']}:"
                           f"{db_config['password']}@"
                           f"{db_config['host']}/"
                           f"{db_config['dbname']}?"
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
        log.error('[VOTE GRABBER] External DB connection error: %s', exc)
    else:
        base = declarative_base()
        base.metadata.bind = engine
        db_session = sessionmaker(bind=engine, autoflush=True, autocommit=False)
        DBH = db_session()

    DBH.query(Votes).\
        filter(func.length(Votes.chash) > 0, Votes.vote_date+86400 < func.now()).\
        delete(synchronize_session=False)

    DBH.commit()
    DBH.close()
