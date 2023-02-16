

CREATE TABLE journal.favorite_food (
    user_id int8 NOT NULL,
    food_id int8 NOT NULL,
    CONSTRAINT favorite_food_pk PRIMARY KEY (user_id, food_id),
    CONSTRAINT food_fk FOREIGN KEY (food_id) REFERENCES food.food(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE journal.favorite_food OWNER TO postgres;
GRANT ALL ON TABLE journal.favorite_food TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE journal.journal_entry_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
GRANT ALL ON SEQUENCE journal.journal_entry_id TO postgres;


CREATE TABLE journal.journal_group (
    ui_index int2 NOT NULL,
    "name" text NOT NULL,
    user_id int8 NOT NULL,
    CONSTRAINT journal_group_pk PRIMARY KEY (ui_index, user_id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id)
);
ALTER TABLE journal.journal_group OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_group TO postgres;


CREATE TABLE journal.journal_entry (
    id int8 NOT NULL DEFAULT nextval('journal.journal_entry_id'::regclass),
    user_id int8 NOT NULL,
    entry_date date NOT NULL,
    entry_time time NOT NULL,
    food_id int8 NOT NULL,
    amount float4 NOT NULL,
    unit text NOT NULL,
    journal_group_ui_index int2 NULL,
    CONSTRAINT journal_entry_pk PRIMARY KEY (id),
    -- CONSTRAINT journal_group_fk FOREIGN KEY (journal_group_ui_index,user_id) REFERENCES journal.journal_group(ui_index,user_id),
    CONSTRAINT food_fk FOREIGN KEY (food_id) REFERENCES food.food(id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id)
);
ALTER TABLE journal.journal_entry OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_entry TO postgres;


CREATE OR REPLACE VIEW journal.journal_entry_food
AS SELECT journal_entry.id,
    journal_entry.user_id,
    journal_entry.entry_date,
    journal_entry.entry_time,
    journal_entry.food_id,
    food.name AS food_name,
    food.density AS food_density,
    journal_entry.amount,
    journal_entry.unit,
    journal_entry.journal_group_ui_index
   FROM journal.journal_entry journal_entry
   JOIN food.food food ON food.id = journal_entry.food_id;
ALTER TABLE journal.journal_entry_food OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_entry_food TO postgres;


CREATE OR REPLACE VIEW journal.user_nutrient_detailed
AS SELECT un.user_id,
    un.nutrient_id,
    un.is_featured,
    un.daily_target_amount,
    un.ui_index,
    nd.name AS nutrient_name,
    nd.daily_value AS nutrient_daily_value,
    nd.unit AS nutrient_unit,
    nd.nutrient_group,
    nd.parent_name AS nutrient_parent_name
   FROM journal.user_nutrient un
   JOIN meta.nutrient_details nd ON nd.id = un.nutrient_id;
ALTER TABLE journal.user_nutrient_detailed OWNER TO postgres;
GRANT ALL ON TABLE journal.user_nutrient_detailed TO postgres;
