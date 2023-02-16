INSERT INTO food.custom_unit ("name",amount,unit,food_id) VALUES
    ('large',50.0,'g',1),
    ('small',35.0,'g',1),
    ('medium',123.0,'g',3)
ON CONFLICT (food_id, name) DO NOTHING;
