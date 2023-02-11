
# Scraping websites for recipes

In the current solution, I'm using https://www.jamieoliver.com/ for data, while ideas should be somewhat universal more work will be necessary.

## Identifying recipe pages

In very rare situations API calls will be visible, but even then you need to find a way to get all recipe page links for future data scraping.

The current example can be found in `get_recipe_pages.js`. The logic is pretty simple:

1. You have a root page from which you can reach all recipes in N number of steps. Currently, it's `https://www.jamieoliver.com/recipes/category/ingredient/`.

2. Since categories can have categories inside, you will need to make recursive calls (`recursiveScrape`) until you reach the page with recipe links.

3. When you reach a page with recipe links you need to make a `selector` (like `a[id^='gtm_recipe_'][href^='/recipes']`) and save all of them.

4. But before writing that array into the file it'd make sense to leave unique links.

## Scraping recipe pages for data

***This part will require many iterations in the future. Ideally adding something similar to machine learning.***

At the moment I target only a limited amount of information:

- `URL: string`

- `ingredients: string[]`

- `instructions: string[]`

- `tags: string[]`

Not accounting for certain quirks:

- Sometimes ingredients might be split into groups, and group titles are saved as ingredients.

- Instructions aren't always saved in the currently identified way, which will cause you to get an empty array in the response.

## Future of the scraping

The current solution is very basic and far from production. The following problems needs to be solved before this data can be used:

- `ingredients` should be converted into a format that can be consumed and saved into the RBA database
    
    - Identifying units and measurements should be mostly possible using regex

    - With removed measurements - basically, only name of the ingredient is left, but you need to link it with real food and that will be complicated (although alternative products might be handy)

- `instructions` should be formatted into something that will make sense with the RBA data model, or ***model needs to be evolved to be more compatible with recipes in the outside world***
    
    - Identifying temperature is not that difficult, but making existing step description make sense without it will be difficult

    - With other types of instructions the main difficulty will be restructuring texts with removed parts like ingredient names and measurement

    - **While recipes aren't copyrightable, some other texts might be.** Researching this might be necessary, but at the same time you might end up in the situation where those texts will not exists in the final product

- More information is necessary:

    - Titles need to be saved (currently a solution for this will be very fragile)

    - `tags` do not exist in current data model, but will be added in the future

## Installation

```sh
# install this project as CLI
npm install --global .
# OUTPUT: added 1 package, and audited 3 packages in 678ms

# and you can run it right away
recipe-scraper --version
# OUTPUT: 0.1.0

# uninstall CLI
npm uninstall -g recipe-scraper
# OUTPUT: removed 1 package, and audited 1 package in 132ms

# alternatively you can run in the dev mode
npm run dev -- --version
# OUTPUT: 0.1.0
```
