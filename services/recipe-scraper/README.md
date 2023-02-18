# Recipe Parser

## Recipe processing

1. Take `ingredient_text` and process it by identifying measurements

    - Identify `AMOUNT` entity, if not found - use default fall back to `1`

        - Take into account `-` as range and `x` as multiplication

    - Identify `UNIT` entity, if not found - use default fall back to `item`/`portion`

2. Take text from `ingredient_text` that was not identified as `AMOUNT` or `UNIT`

    - Take into account `of` (this one might be dropped if it's first after `AMOUNT` or `UNIT`) and `or`

3. Use search by similarity with `food` database and text from previous step

    - It's possible to use postgres directly like this:
        ```sql
        SELECT *
        FROM recipe.food
        WHERE SIMILARITY(name, 'olive oil') > 0.4
        ORDER BY SIMILARITY(name, 'olive oil') DESC
        LIMIT 1
        ```

    - Or spacy itself also has functionality like this, but might not worth the time to rewrite example above

