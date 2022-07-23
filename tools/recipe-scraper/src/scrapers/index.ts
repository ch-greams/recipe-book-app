import type { WebsiteScraper } from "../common/website-scraper";
import { Website } from "../common/website-scraper";

import { JamieOliverWebsite } from "./jamieoliver";


export function getWebsiteScraper(type: Website): WebsiteScraper {
    switch (type) {
        case Website.JamieOliver:
        case Website.NYTimes:
            return new JamieOliverWebsite();
    }
}

