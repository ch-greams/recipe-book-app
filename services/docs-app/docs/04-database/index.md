
# Database

...

### `meta.*`

Contains tables and views that will store metadata which will be readonly for users and won't be changed often.

### `product.*`

Default recipe-book schema at the moment. Stores all non-user specific product information.

### [`journal.*`](./journal)

This schema is used to store all user-specific information.

### `public.*`

Default postgres schema, not used specifically by recipe-book, but sqlx does save migration info in there.

### `recipe_scraper.*`

Currently used by `tools/recipe-scraper` and `tools/research-notebooks/recipes_jamieoliver.ipynb` to generate graphs based on data scraped from `jamieoliver` website.

### `usda.*`

This schema tries to replicate USDA database without tables that won't be useful in our case like `lab_method`, `agricultural_samples`, etc.
