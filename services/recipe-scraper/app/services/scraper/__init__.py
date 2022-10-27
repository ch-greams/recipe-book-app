from app.services.scraper.jamie_oliver import JamieOliver


SCRAPERS = {
    JamieOliver.host(): JamieOliver,
}
