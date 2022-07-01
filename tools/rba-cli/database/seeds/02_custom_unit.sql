INSERT INTO private.custom_unit ("name",amount,unit,product_id) VALUES
	 ('large',50.0,'g',1),
	 ('medium',123.0,'g',3)
ON CONFLICT (product_id, name) DO NOTHING;
