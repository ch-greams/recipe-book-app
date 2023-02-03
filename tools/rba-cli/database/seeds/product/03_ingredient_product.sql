INSERT INTO product.ingredient_product (id,ingredient_id,product_id,amount,unit) VALUES
    (1,6,4,125.0,'g'),
    (2,7,2,100.0,'g'),
    (3,8,5,141.74759999999998,'oz'),
    (4,9,3,60.0,'g'),
    (5,10,1,53.0,'g')
ON CONFLICT (id) DO NOTHING;
