INSERT INTO journal.user_nutrient (user_id, nutrient_id, is_featured, daily_target_amount, ui_index) VALUES
    (1, 1, TRUE, NULL, 1),
    (1, 5, TRUE, NULL, 2),
    (1, 6, TRUE, 31, 3),
    (1, 8, TRUE, NULL, 4),
    (1, 9, TRUE, NULL, 5),
    (1, 10, TRUE, 22.5, 6),
    (1, 18, TRUE, 87.2, 7),
    (1, 58, TRUE, NULL, 8),
    (1, 38, TRUE, NULL, 9),
    (1, 39, TRUE, NULL, 10)
ON CONFLICT (user_id, nutrient_id) DO NOTHING;
