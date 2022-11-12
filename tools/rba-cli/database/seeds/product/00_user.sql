INSERT INTO product."user" (id,email,"password",first_name,last_name) VALUES
	 (1,'admin@greams.io','MTIzCg==','Andrei','Khvalko'),
	 (0,'admin@rba.io','MTIzCg==','System','Administrator')
ON CONFLICT (id) DO NOTHING;
