INSERT INTO journal.favorite_food (user_id,food_id) VALUES
    (1,1),
    (1,3),
    (1,5),
    (1,6)
ON CONFLICT (user_id,food_id) DO NOTHING;
