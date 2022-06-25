
## Serving Size

- In ***edit mode*** changing value of the ***Serving Size*** should not update nutrition fact values, because it is expected that in this situation user is adjusting ***Serving Size*** amount for current nutrition facts to make sense.

    - While keeping it this way for any product - it is crucial for recipes, but not for foods.

- Changing ***ingredients*** should automatically re-calculate ***Serving Size***, which user can adjust later. Think of the recipe where final weight is less than a sum of ***ingredients*** because some amount of water evaporated during cooking process.

- In **read mode** changing value of the ***Serving Size*** should recalculate nutrition fact values, because in this mode we assume that user wants to select portion size for cooking/consumption.

## Units

- All amounts stored in database will use metric values, or more specifically grams (`g`) or grams per milliliter (`g/ml`) for density.

- Unit information which is attached to food/recipe in the database allows us to have "default units suggested by the author". ***It is not related to the amount values in the databse!***

- !!! Behaviour of user-specific unit setting needs to be defined

## Ingredients

- It is virtually impossible to allow ***ingredient replacement*** in the ***recipe*** that is used as an ingredient on another page. And in this case I suggest to copy that recipe into ***your recipe book***, and replace ***ingredient products*** to your liking and then use this ***recipe as an ingredient***.

## Nutrition Facts

- Always stored values per 100g of the product, and saved serving size does not affect it in the database.
