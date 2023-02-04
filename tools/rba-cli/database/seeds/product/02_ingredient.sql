INSERT INTO product.ingredient (id,recipe_id,product_id,amount,unit) VALUES
    (1,6,4,125.0,'g'),
    (2,6,2,100.0,'g'),
    (3,6,5,141.74759999999998,'oz'),
    (4,6,3,60.0,'g'),
    (5,6,1,53.0,'g')
ON CONFLICT (id) DO NOTHING;
