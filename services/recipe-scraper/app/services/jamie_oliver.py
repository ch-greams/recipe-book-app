
from app.common.utils import get_text
from app.services.page_scraper import PageScraper


class JamieOliver(PageScraper):
    @classmethod
    def host(cls):
        return "jamieoliver.com"

    def title(self) -> str:
        title_tag = self.soup.find("h1")
        return get_text(title_tag)

    def time(self) -> str:
        time_element = self.soup.select_one(".recipe-detail.time > .detail_desc").next_sibling
        return get_text(time_element)

    def yields(self) -> str:
        yields_element = self.soup.select_one(".recipe-detail.serves > .detail_desc").next_sibling
        return get_text(yields_element)

    def ingredients(self) -> list[str]:
        ingredient_tags = self.soup.select(".ingred-list li:not(.ingred-heading)")
        return [ get_text(ingredient_tag) for ingredient_tag in ingredient_tags ]

    def instructions(self) -> list[str]:
        instruction_tags = self.soup.select(".recipeSteps li")
        return [ get_text(instruction_tag) for instruction_tag in instruction_tags ]
