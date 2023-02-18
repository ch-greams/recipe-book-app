INSERT INTO recipe.instruction (id,recipe_id,step_number,description,temperature_value,temperature_unit,duration_value,duration_unit) VALUES
    (3,6,0,'Create a burger patty by mixing egg with ground beef and salt it a bit.',NULL,'C',NULL,'min'),
    (4,6,1,'Bake the patty. You can flip it after 8 min, but not necessary. Add cheese at the last minute.',82.22222,'F',900,'min'),
    (5,6,2,'Put everything together.',NULL,'C',NULL,'min')
ON CONFLICT (id) DO NOTHING;
