INSERT INTO journal.favorite_product (user_id,product_id) VALUES
    (1,1),
    (1,3),
    (1,5),
    (1,6)
ON CONFLICT (user_id,product_id) DO NOTHING;
