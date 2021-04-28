import time
import logging

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import WebDriverException
from rest.lib.config import Configuration


class WebScreen:
    def __init__(self, config: Configuration):
        self.__chrome_config = config.get_section('CHROME')
        self.__chrome_options = Options()
        self.__chrome_options.add_argument("--headless")
        self.__chrome_options.add_argument("--window-size=%s" % self.__chrome_config['resolution'])
        self.__chrome_options.add_argument('--no-sandbox')
        self.__chrome_options.add_argument('--disable-gpu')
        self.__chrome_options.add_argument('--disable-dev-shm-usage')
        self.__chrome_options.add_argument('--disable-infobars')
        self.__chrome_options.add_argument('--disable-extensions')
        self.__chrome_options.add_argument('--remote-debugging-port=9222')
        self.__chrome_options.binary_location = self.__chrome_config['chrome']
        self.__log = logging.getLogger("main")

    def take_screenshot(self, url, output):
        ret: bool = False

        if url and url.startswith('http'):
            try:
                driver = webdriver.Chrome(
                    executable_path=self.__chrome_config['driver'],
                    chrome_options=self.__chrome_options
                )

                driver.get(url)
                time.sleep(5)
                driver.save_screenshot(output)
                driver.close()
                driver.quit()
            except WebDriverException as exc:
                self.__log.info("[REST] Webscreen raise exception %s", exc)
            else:
                ret = True

        return ret
