
# Serving Size

- In ***edit mode*** changing value of the ***Serving Size*** should not update nutrient values, because it is expected that in this situation user is adjusting ***Serving Size*** amount for current nutrients to make sense.

    - While keeping it this way for any food - it is crucial for recipes, but not for foods.

- Changing ***ingredients*** should automatically re-calculate ***Serving Size***, which user can adjust later. Think of the recipe where final weight is less than a sum of ***ingredients*** because some amount of water evaporated during cooking process.

- In **read mode** changing value of the ***Serving Size*** should recalculate nutrient values, because in this mode we assume that user wants to select portion size for cooking/consumption.

