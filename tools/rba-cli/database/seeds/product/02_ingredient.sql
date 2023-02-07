INSERT INTO product.ingredient (id,slot_number,recipe_id,product_id,amount,unit,is_alternative) VALUES
    (1,1,6,4,125.0,'g',false),
    (2,2,6,2,100.0,'g',false),
    (3,3,6,5,141.74759999999998,'oz',false),
    (4,4,6,3,60.0,'g',false),
    (5,5,6,1,53.0,'g',false)
ON CONFLICT (id) DO NOTHING;
