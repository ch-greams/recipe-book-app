INSERT INTO journal.journal_group (order_number,"name",user_id) VALUES
	 (1,'breakfast',1),
	 (2,'lunch',1),
	 (3,'dinner',1)
ON CONFLICT (order_number, user_id) DO NOTHING;
