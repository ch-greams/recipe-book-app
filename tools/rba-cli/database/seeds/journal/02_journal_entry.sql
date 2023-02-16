INSERT INTO journal.journal_entry (id,user_id,entry_date,entry_time,food_id,amount,unit,journal_group_ui_index) VALUES
    (1, 1, '2022-11-04', '07:14:00', 1, 212, 'g', 1),
    (2, 1, '2022-11-04', '12:25:00', 6, 450.4, 'g', 2),
    (3, 1, '2022-11-04', '13:30:00', 5, 99.5, 'g', NULL)
ON CONFLICT (id) DO NOTHING;
