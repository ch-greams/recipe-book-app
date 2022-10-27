INSERT INTO private.ingredient (id,recipe_id,product_id) VALUES
	 (6,6,4),
	 (7,6,2),
	 (8,6,5),
	 (9,6,3),
	 (10,6,1)
ON CONFLICT (id) DO NOTHING;
