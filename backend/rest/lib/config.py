from configparser import ConfigParser


class Configuration:
    __config: ConfigParser = ConfigParser()

    def __init__(self, config_file: str = None):
        self.load(config_file)

    def load(self, config_file: str = None):
        if str:
            self.__config.read(config_file)

    def get_section(self, section):
        return self.__config[section];

# if "REST" not in config:
#     config.add_section("MAIN")
#
# if "loglevel" not in config["MAIN"]:
#     config.set("MAIN", "loglevel", "INFO")
# if "logpath" not in config["MAIN"]:
#     config.set("MAIN", "logpath", scriptdir() + '/../log')
# config.set("MAIN", "logpath", os.path.join(config['MAIN']['logpath'], ''))
# if "maxbytes" not in config["MAIN"]:
#     config.set("MAIN", "maxbytes", "10485760")
# if "backupcount" not in config["MAIN"]:
#     config.set("MAIN", "backupcount", "4")
# if "workers" not in config["MAIN"]:
#     config.set("MAIN", "workers", "1")
# if "loop" not in config["MAIN"]:
#     config.set("MAIN", "loop", "asyncio")
# if "host" not in config["MAIN"]:
#     config.set("MAIN", "host", "127.0.0.1")
# if "port" not in config["MAIN"]:
#     config.set("MAIN", "port", "8000")
