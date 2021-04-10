import os

from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from rest.lib.config import Configuration
from rest.model.Sites import Sites


if __name__ == "__main__":
    config: Configuration = Configuration('server.ini')
    router_config = config.get_section('ROUTER')
    db_config = config.get_section('DATABASE')

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
        log.error('[STORAGE GRABBER] External DB connection error: %s', exc)
    else:
        base = declarative_base()
        base.metadata.bind = engine
        db_session = sessionmaker(bind=engine, autoflush=True, autocommit=False)
        DBH = db_session()

    dir_files = [x for x in os.listdir(router_config['image_storage_dir']) if x.endswith("_small.png")]
    sites: Sites = DBH.query(Sites.img_link).all()
    DBH.close()

    for file in dir_files:
        file = file.replace('_small.png', '')
        has_file: bool = False
        for site in sites:
            if file.lower() == site.img_link.lower():
                has_file = True
        if not has_file:
            os.remove(router_config['image_storage_dir']+'/'+file+'_small.png')
            os.remove(router_config['image_storage_dir']+'/'+file+'.png')





