import requests
from bs4 import BeautifulSoup


HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0"
}


class PageScraper:
    def __init__(self, url: str):
        response = requests.get(url, headers=HEADERS)
        self.url = response.url
        self.soup = BeautifulSoup(response.content, "html.parser")

    @classmethod
    def host(cls) -> str:
        raise NotImplementedError("This should be implemented.")

    def title(self) -> str:
        raise NotImplementedError("This should be implemented.")

    def time(self) -> str:
        raise NotImplementedError("This should be implemented.")

    def yields(self) -> str:
        raise NotImplementedError("This should be implemented.")

    def ingredients(self) -> list[str]:
        raise NotImplementedError("This should be implemented.")

    def instructions(self) -> list[str]:
        raise NotImplementedError("This should be implemented.")

