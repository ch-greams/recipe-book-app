
CREATE SCHEMA product AUTHORIZATION postgres;
GRANT ALL ON SCHEMA product TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE product.instruction_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 100
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE product.instruction_id OWNER TO postgres;
GRANT ALL ON SEQUENCE product.instruction_id TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE product.ingredient_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
ALTER SEQUENCE product.ingredient_id OWNER TO postgres;
GRANT ALL ON SEQUENCE product.ingredient_id TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE product.product_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
ALTER SEQUENCE product.product_id OWNER TO postgres;
GRANT ALL ON SEQUENCE product.product_id TO postgres;


CREATE TABLE product.product (
    id int8 NOT NULL DEFAULT nextval('product.product_id'::regclass),
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
    CONSTRAINT product_pk PRIMARY KEY (id),
    CONSTRAINT serving_size_check CHECK ((serving_size > (0)::double precision)) NOT VALID,
    CONSTRAINT created_by_fk FOREIGN KEY (created_by) REFERENCES journal."user"(id)
);
ALTER TABLE product.product OWNER TO postgres;
GRANT ALL ON TABLE product.product TO postgres;


CREATE TABLE product.custom_unit (
    "name" text NOT NULL,
    amount float8 NOT NULL,
    unit text NOT NULL,
    product_id int8 NOT NULL,
    CONSTRAINT custom_unit_pk PRIMARY KEY (product_id, name),
    CONSTRAINT custom_unit_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.custom_unit OWNER TO postgres;
GRANT ALL ON TABLE product.custom_unit TO postgres;


CREATE TABLE product.instruction (
	id int8 NOT NULL DEFAULT nextval('product.instruction_id'::regclass),
	step_number int2 NOT NULL,
	recipe_id int8 NOT NULL,
	description text NOT NULL,
	temperature_value float4 NULL,
	temperature_unit text NOT NULL DEFAULT 'C'::text,
	duration_value int4 NULL,
	duration_unit text NOT NULL DEFAULT 'min'::text,
	CONSTRAINT instruction_pk PRIMARY KEY (id),
	CONSTRAINT instruction_step_uq UNIQUE (recipe_id, step_number),
	CONSTRAINT instruction_fk FOREIGN KEY (recipe_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.instruction OWNER TO postgres;
GRANT ALL ON TABLE product.instruction TO postgres;


CREATE TABLE product.ingredient (
    id int8 NOT NULL DEFAULT nextval('product.ingredient_id'::regclass),
    slot_number int2 NOT NULL,
    recipe_id int8 NOT NULL,
    product_id int8 NOT NULL,
    amount float8 NOT NULL,
    unit text NOT NULL,
    is_alternative bool NOT NULL DEFAULT false,
    CONSTRAINT ingredient_pk PRIMARY KEY (id),
    CONSTRAINT ingredient_product_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ingredient_recipe_fk FOREIGN KEY (recipe_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.ingredient OWNER TO postgres;
GRANT ALL ON TABLE product.ingredient TO postgres;


CREATE TABLE product.product_nutrient (
    nutrient_id int2 NOT NULL,
    product_id int8 NOT NULL,
    amount float4 NOT NULL,
    CONSTRAINT product_nutrient_pk PRIMARY KEY (nutrient_id, product_id),
    CONSTRAINT nutrient_id_fk FOREIGN KEY (nutrient_id) REFERENCES meta.nutrient(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT product_id_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX product_nutrient_product_id_idx ON product.product_nutrient USING btree (product_id);
ALTER TABLE product.product_nutrient OWNER TO postgres;
GRANT ALL ON TABLE product.product_nutrient TO postgres;


CREATE TABLE product.instruction_ingredient (
	instruction_id int8 NOT NULL,
	ingredient_slot_number int2 NOT NULL,
	ingredient_percentage float4 NOT NULL,
	CONSTRAINT instruction_ingredient_percentage_check CHECK (((ingredient_percentage > (0)::real) AND (ingredient_percentage <= (1)::real))),
	CONSTRAINT instruction_ingredient_pk PRIMARY KEY (instruction_id, ingredient_slot_number),
	CONSTRAINT instruction_fk FOREIGN KEY (instruction_id) REFERENCES product.instruction(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.instruction_ingredient OWNER TO postgres;
GRANT ALL ON TABLE product.instruction_ingredient TO postgres;

-- VIEWS

CREATE OR REPLACE VIEW product.product_nutrient_detailed
AS SELECT pn.product_id,
    n.name,
    pn.amount
   FROM product.product_nutrient pn
     LEFT JOIN meta.nutrient n ON n.id = pn.nutrient_id;
ALTER TABLE product.product_nutrient_detailed OWNER TO postgres;
GRANT ALL ON TABLE product.product_nutrient_detailed TO postgres;


CREATE OR REPLACE VIEW product.ingredient_detailed
AS SELECT i.id,
    i.slot_number,
    i.recipe_id,
    i.product_id,
    i.amount,
    i.unit,
    i.is_alternative,
    p.is_recipe,
    p.name,
    p.density,
    COALESCE(jsonb_object_agg(pnd.name, pnd.amount) FILTER (WHERE pnd.name IS NOT NULL), '{}'::jsonb) AS nutrients
   FROM product.ingredient i
     LEFT JOIN product.product p ON p.id = i.product_id
     LEFT JOIN product.product_nutrient_detailed pnd ON pnd.product_id = i.product_id
  GROUP BY i.id, p.id;
ALTER TABLE product.ingredient_detailed OWNER TO postgres;
GRANT ALL ON TABLE product.ingredient_detailed TO postgres;


CREATE OR REPLACE VIEW product.instruction_detailed
AS SELECT i.id,
    i.step_number,
    i.recipe_id,
    i.description,
    i.temperature_value,
    i.temperature_unit,
    i.duration_value,
    i.duration_unit,
    jsonb_agg(ii.*) AS ingredients
   FROM product.instruction i
     LEFT JOIN product.instruction_ingredient ii ON ii.instruction_id = i.id
  GROUP BY i.id;
ALTER TABLE product.instruction_detailed OWNER TO postgres;
GRANT ALL ON TABLE product.instruction_detailed TO postgres;
