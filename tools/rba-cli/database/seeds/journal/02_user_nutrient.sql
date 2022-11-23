INSERT INTO journal.user_nutrient (user_id, nutrient_id, is_featured, daily_target_amount) VALUES
    (1, 1, TRUE, NULL),
    (1, 5, TRUE, NULL),
    (1, 6, TRUE, NULL),
    (1, 8, TRUE, NULL),
    (1, 9, TRUE, NULL),
    (1, 10, TRUE, NULL),
    (1, 18, TRUE, NULL),
    (1, 58, TRUE, NULL),
    (1, 38, TRUE, NULL),
    (1, 39, TRUE, NULL)
ON CONFLICT (user_id, nutrient_id) DO NOTHING;
