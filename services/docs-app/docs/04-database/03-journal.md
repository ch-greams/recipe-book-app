
# `journal.*`

This schema is used to store all user-specific information. Will include following tables:
- `journal_entry`
    - `user_id: int8` - fk to `journal.user`
    - `datetime: date`
    - `food_id: int8` - fk to `food.food`
    - `amount: float4`
    - `unit: text`
    - `journal_group_id?: int8` - [optional] fk to `journal.journal_group`
- `journal_group` - [optional] not really required, but kind of nice to have an ability to split day into `breakfast`/`lunch`/`dinner`
	- `id: int8`
    - `name: text`
    - `user_id: int8` - fk to `journal.user`
- `user` - currently in a bit odd state, some of the fields will be moved into `keycloak` while at the same time I expect current schema to grow and maybe split between `journal` stuff and `user` settings
	- `id: int8`
	- `email: text`
	- `password: text`
	- `first_name: text`
	- `last_name: text`
- `favorite_food`
    - `food_id: int8` - fk to `food.food`
    - `user_id: int8` - fk to `journal.user`
- `user_nutrient` ( `featured_nutrient` / `nutrient_target` )
    - `user_id: int8` - fk to `journal.user`
    - `nutrient_id: int2` - fk to `meta.nutrient`
    - `is_featured: bool`
    - `daily_target_amount: float4`
