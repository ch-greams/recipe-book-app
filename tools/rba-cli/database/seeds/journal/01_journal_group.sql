INSERT INTO journal.journal_group (ui_index,"name",user_id) VALUES
	 (1,'breakfast',1),
	 (2,'lunch',1),
	 (3,'dinner',1)
ON CONFLICT (ui_index, user_id) DO NOTHING;
