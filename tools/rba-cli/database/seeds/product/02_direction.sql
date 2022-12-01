INSERT INTO product.direction (recipe_id,step_number,"name",id,temperature_value,temperature_unit,duration_value,duration_unit) VALUES
	 (6,0,'Create burger patty',3,NULL,'C',NULL,'min'),
	 (6,1,'Bake the patty',4,82.22222,'F',900,'min'),
	 (6,2,'Put everything together',5,NULL,'C',NULL,'min')
ON CONFLICT (id) DO NOTHING;
