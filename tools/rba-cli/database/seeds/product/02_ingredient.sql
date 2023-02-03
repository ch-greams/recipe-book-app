INSERT INTO product.ingredient (id,recipe_id,product_id) VALUES
    (6,6,1),
    (7,6,2),
    (8,6,3),
    (9,6,4),
    (10,6,5)
ON CONFLICT (id) DO NOTHING;
