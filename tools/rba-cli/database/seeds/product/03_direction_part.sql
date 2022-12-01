INSERT INTO product.direction_part (direction_id,step_number,"direction_part_type",comment_text,ingredient_id,ingredient_amount) VALUES
	 (3,0,'ingredient',NULL,6,1.0),
	 (3,1,'ingredient',NULL,10,1.0),
	 (3,2,'note','Mix egg with ground beef and salt it a bit',NULL,NULL),
	 (4,0,'tip','You can flip it after 8 min, but not necessary',NULL,NULL),
	 (4,1,'ingredient',NULL,8,1.0),
	 (4,2,'note','Add cheese at the last minute',NULL,NULL),
	 (5,0,'ingredient',NULL,7,0.5),
	 (5,1,'ingredient',NULL,9,1.0),
	 (5,2,'note','Baked patty goes here',NULL,NULL),
	 (5,3,'ingredient',NULL,7,0.5)
ON CONFLICT (direction_id, step_number) DO NOTHING;
