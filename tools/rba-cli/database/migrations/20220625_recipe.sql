
CREATE SCHEMA recipe AUTHORIZATION postgres;
GRANT ALL ON SCHEMA recipe TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE recipe.instruction_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 100
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE recipe.instruction_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe.instruction_id TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE recipe.ingredient_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
ALTER SEQUENCE recipe.ingredient_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe.ingredient_id TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE recipe.food_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
ALTER SEQUENCE recipe.food_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe.food_id TO postgres;


CREATE TABLE recipe.food (
    id int8 NOT NULL DEFAULT nextval('recipe.food_id'::regclass),
    "name" text NOT NULL,
    brand text NOT NULL,
    description text NOT NULL,
    density float8 NOT NULL DEFAULT 1,
    created_by int8 NOT NULL,
    is_private bool NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    serving_size float8 NOT NULL DEFAULT 100,
    is_deleted bool NOT NULL DEFAULT false,
    is_recipe bool NOT NULL DEFAULT false,
    CONSTRAINT density_check CHECK ((density > (0)::double precision)) NOT VALID,
    CONSTRAINT food_pk PRIMARY KEY (id),
    CONSTRAINT serving_size_check CHECK ((serving_size > (0)::double precision)) NOT VALID,
    CONSTRAINT created_by_fk FOREIGN KEY (created_by) REFERENCES journal."user"(id)
);
ALTER TABLE recipe.food OWNER TO postgres;
GRANT ALL ON TABLE recipe.food TO postgres;


CREATE TABLE recipe.custom_unit (
    "name" text NOT NULL,
    amount float8 NOT NULL,
    unit text NOT NULL,
    food_id int8 NOT NULL,
    CONSTRAINT custom_unit_pk PRIMARY KEY (food_id, name),
    CONSTRAINT custom_unit_fk FOREIGN KEY (food_id) REFERENCES recipe.food(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE recipe.custom_unit OWNER TO postgres;
GRANT ALL ON TABLE recipe.custom_unit TO postgres;


CREATE TABLE recipe.instruction (
	id int8 NOT NULL DEFAULT nextval('recipe.instruction_id'::regclass),
	step_number int2 NOT NULL,
	recipe_id int8 NOT NULL,
	description text NOT NULL,
	temperature_value float4 NULL,
	temperature_unit text NOT NULL DEFAULT 'C'::text,
	duration_value int4 NULL,
	duration_unit text NOT NULL DEFAULT 'min'::text,
	CONSTRAINT instruction_pk PRIMARY KEY (id),
	CONSTRAINT instruction_step_uq UNIQUE (recipe_id, step_number),
	CONSTRAINT instruction_fk FOREIGN KEY (recipe_id) REFERENCES recipe.food(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE recipe.instruction OWNER TO postgres;
GRANT ALL ON TABLE recipe.instruction TO postgres;


CREATE TABLE recipe.ingredient (
    id int8 NOT NULL DEFAULT nextval('recipe.ingredient_id'::regclass),
    slot_number int2 NOT NULL,
    recipe_id int8 NOT NULL,
    food_id int8 NOT NULL,
    amount float8 NOT NULL,
    unit text NOT NULL,
    is_alternative bool NOT NULL DEFAULT false,
    CONSTRAINT ingredient_pk PRIMARY KEY (id),
    CONSTRAINT ingredient_food_fk FOREIGN KEY (food_id) REFERENCES recipe.food(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ingredient_recipe_fk FOREIGN KEY (recipe_id) REFERENCES recipe.food(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE recipe.ingredient OWNER TO postgres;
GRANT ALL ON TABLE recipe.ingredient TO postgres;


CREATE TABLE recipe.food_nutrient (
    nutrient_id int2 NOT NULL,
    food_id int8 NOT NULL,
    amount float4 NOT NULL,
    CONSTRAINT food_nutrient_pk PRIMARY KEY (nutrient_id, food_id),
    CONSTRAINT nutrient_id_fk FOREIGN KEY (nutrient_id) REFERENCES meta.nutrient(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT food_id_fk FOREIGN KEY (food_id) REFERENCES recipe.food(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX food_nutrient_food_id_idx ON recipe.food_nutrient USING btree (food_id);
ALTER TABLE recipe.food_nutrient OWNER TO postgres;
GRANT ALL ON TABLE recipe.food_nutrient TO postgres;


CREATE TABLE recipe.instruction_ingredient (
	instruction_id int8 NOT NULL,
	ingredient_slot_number int2 NOT NULL,
	ingredient_percentage float4 NOT NULL,
	CONSTRAINT instruction_ingredient_percentage_check CHECK (((ingredient_percentage > (0)::real) AND (ingredient_percentage <= (1)::real))),
	CONSTRAINT instruction_ingredient_pk PRIMARY KEY (instruction_id, ingredient_slot_number),
	CONSTRAINT instruction_fk FOREIGN KEY (instruction_id) REFERENCES recipe.instruction(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE recipe.instruction_ingredient OWNER TO postgres;
GRANT ALL ON TABLE recipe.instruction_ingredient TO postgres;

-- VIEWS

CREATE OR REPLACE VIEW recipe.food_nutrient_detailed
AS SELECT fn.food_id,
    n.name,
    fn.amount
   FROM recipe.food_nutrient fn
     LEFT JOIN meta.nutrient n ON n.id = fn.nutrient_id;
ALTER TABLE recipe.food_nutrient_detailed OWNER TO postgres;
GRANT ALL ON TABLE recipe.food_nutrient_detailed TO postgres;


CREATE OR REPLACE VIEW recipe.ingredient_detailed
AS SELECT i.id,
    i.slot_number,
    i.recipe_id,
    i.food_id,
    i.amount,
    i.unit,
    i.is_alternative,
    f.is_recipe,
    f.name,
    f.density,
    COALESCE(jsonb_object_agg(fnd.name, fnd.amount) FILTER (WHERE fnd.name IS NOT NULL), '{}'::jsonb) AS nutrients
   FROM recipe.ingredient i
     LEFT JOIN recipe.food f ON f.id = i.food_id
     LEFT JOIN recipe.food_nutrient_detailed fnd ON fnd.food_id = i.food_id
  GROUP BY i.id, f.id;
ALTER TABLE recipe.ingredient_detailed OWNER TO postgres;
GRANT ALL ON TABLE recipe.ingredient_detailed TO postgres;


CREATE OR REPLACE VIEW recipe.instruction_detailed
AS SELECT i.id,
    i.step_number,
    i.recipe_id,
    i.description,
    i.temperature_value,
    i.temperature_unit,
    i.duration_value,
    i.duration_unit,
    jsonb_agg(ii.*) AS ingredients
   FROM recipe.instruction i
     LEFT JOIN recipe.instruction_ingredient ii ON ii.instruction_id = i.id
  GROUP BY i.id;
ALTER TABLE recipe.instruction_detailed OWNER TO postgres;
GRANT ALL ON TABLE recipe.instruction_detailed TO postgres;
