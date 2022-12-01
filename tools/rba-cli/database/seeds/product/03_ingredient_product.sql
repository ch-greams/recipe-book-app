INSERT INTO product.ingredient_product (ingredient_id,product_id,amount,unit) VALUES
	 (6,4,125.0,'g'),
	 (7,2,100.0,'g'),
	 (8,5,141.74759999999998,'oz'),
	 (9,3,60.0,'g'),
	 (10,1,53.0,'g')
ON CONFLICT (ingredient_id, product_id) DO NOTHING;
