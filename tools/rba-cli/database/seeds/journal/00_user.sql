INSERT INTO journal."user" (id,email,first_name,last_name) VALUES
	 (1,'admin@greams.io','Andrei','Khvalko'),
	 (0,'admin@rba.io','System','Administrator')
ON CONFLICT (id) DO NOTHING;
