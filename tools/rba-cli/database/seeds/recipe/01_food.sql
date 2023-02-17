INSERT INTO recipe.food (id,is_recipe,"name",brand,description,density,created_by,is_private,created_at,updated_at,serving_size) VALUES
	 (1,false,'Egg','','',1.0,1,false,'2022-06-27 03:38:11.911965+02','2022-06-27 03:38:11.912034+02',100.0),
	 (2,false,'Burger Bun','','',1.0,1,false,'2022-06-27 03:40:07.8302+02','2022-06-27 03:40:07.830227+02',100.0),
	 (3,false,'Tomato','','',1.0,1,false,'2022-06-27 03:41:41.850918+02','2022-06-27 03:41:41.850934+02',100.0),
	 (4,false,'Ground Beef','','',1.0,1,false,'2022-06-27 03:42:48.752484+02','2022-06-27 03:42:48.752504+02',100.0),
	 (5,false,'Cheddar Cheese','DELHAIZE','',1.0,1,false,'2022-06-27 03:44:33.845033+02','2022-06-27 03:44:33.845052+02',100.0),
	 (6,true,'Hamburger','Homemade','',1.0,1,false,'2022-06-27 03:54:32.832099+02','2022-06-27 03:54:32.832114+02',479.7476)
ON CONFLICT (id) DO NOTHING;
