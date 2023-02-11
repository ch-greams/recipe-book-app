INSERT INTO product.instruction_ingredient (instruction_id,ingredient_slot_number,ingredient_percentage) VALUES
    (3,1,1.0),
    (3,5,1.0),
    (4,3,1.0),
    (5,2,0.5),
    (5,4,1.0),
    (5,2,0.5)
ON CONFLICT (instruction_id, ingredient_slot_number) DO NOTHING;
