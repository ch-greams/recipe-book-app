
CREATE SCHEMA product AUTHORIZATION postgres;
GRANT ALL ON SCHEMA product TO postgres;


CREATE TYPE product."direction_part_type" AS ENUM ('ingredient', 'note', 'warning', 'tip');
CREATE TYPE product."product_type" AS ENUM ('food', 'recipe');


-- First 100 reserved for testing purposes
CREATE SEQUENCE product.direction_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
ALTER SEQUENCE product.direction_id OWNER TO postgres;
GRANT ALL ON SEQUENCE product.direction_id TO postgres;


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


CREATE SEQUENCE product.product_nutrient_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1
    NO CYCLE;
ALTER SEQUENCE product.product_nutrient_id OWNER TO postgres;
GRANT ALL ON SEQUENCE product.product_nutrient_id TO postgres;


CREATE TABLE product.product (
    id int8 NOT NULL DEFAULT nextval('product.product_id'::regclass),
    "type" product."product_type" NOT NULL,
    "name" text NOT NULL,
    brand text NOT NULL,
    subtitle text NOT NULL,
    description text NOT NULL,
    density float8 NOT NULL DEFAULT 1,
    created_by int8 NOT NULL,
    is_private bool NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    serving_size float8 NOT NULL DEFAULT 100,
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


CREATE TABLE product.direction (
    recipe_id int8 NOT NULL,
    step_number int2 NOT NULL,
    "name" text NOT NULL,
    id int8 NOT NULL DEFAULT nextval('product.direction_id'::regclass),
    temperature_value float4 NULL,
    temperature_unit text NOT NULL DEFAULT 'C'::text,
    duration_value int4 NULL,
    duration_unit text NOT NULL DEFAULT 'min'::text,
    CONSTRAINT direction_pk PRIMARY KEY (id),
    CONSTRAINT recipe_step_uq UNIQUE (recipe_id, step_number),
    CONSTRAINT direction_fk FOREIGN KEY (recipe_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.direction OWNER TO postgres;
GRANT ALL ON TABLE product.direction TO postgres;


CREATE TABLE product.ingredient (
    id int8 NOT NULL DEFAULT nextval('product.ingredient_id'::regclass),
    recipe_id int8 NOT NULL,
    product_id int8 NULL,
    CONSTRAINT ingredient_pk PRIMARY KEY (id),
    CONSTRAINT ingredient_product_fk FOREIGN KEY (product_id) REFERENCES product.product(id),
    CONSTRAINT ingredient_recipe_fk FOREIGN KEY (recipe_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.ingredient OWNER TO postgres;
GRANT ALL ON TABLE product.ingredient TO postgres;


CREATE TABLE product.ingredient_product (
    ingredient_id int8 NOT NULL,
    product_id int8 NOT NULL,
    amount float8 NOT NULL,
    unit text NOT NULL,
    CONSTRAINT ingredient_product_pk PRIMARY KEY (ingredient_id, product_id),
    CONSTRAINT ingredient_product_ingredient_fk FOREIGN KEY (ingredient_id) REFERENCES product.ingredient(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ingredient_product_product_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX fki_ingredient_product_ingredient_fk ON product.ingredient_product USING btree (ingredient_id);
CREATE INDEX fki_ingredient_product_product_fk ON product.ingredient_product USING btree (product_id);
ALTER TABLE product.ingredient_product OWNER TO postgres;
GRANT ALL ON TABLE product.ingredient_product TO postgres;


CREATE TABLE product.product_nutrient (
    id int8 NOT NULL DEFAULT nextval('product.product_nutrient_id'::regclass),
    nutrient_id int2 NOT NULL,
    product_id int8 NOT NULL,
    amount float4 NOT NULL,
    CONSTRAINT product_nutrient_pk PRIMARY KEY (id),
    CONSTRAINT product_nutrient_un UNIQUE (nutrient_id, product_id),
    CONSTRAINT nutrient_id_fk FOREIGN KEY (nutrient_id) REFERENCES meta.nutrient(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT product_id_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.product_nutrient OWNER TO postgres;
GRANT ALL ON TABLE product.product_nutrient TO postgres;


CREATE TABLE product.direction_part (
    direction_id int8 NOT NULL,
    step_number int2 NOT NULL,
    "direction_part_type" product."direction_part_type" NOT NULL,
    comment_text text NULL,
    ingredient_id int8 NULL,
    ingredient_amount float8 NULL,
    CONSTRAINT direction_part_ingredient_amount_check CHECK (((ingredient_amount > (0)::double precision) AND (ingredient_amount <= (1)::double precision))) NOT VALID,
    CONSTRAINT direction_part_pk PRIMARY KEY (direction_id, step_number),
    CONSTRAINT direction_part_type_check CHECK (
CASE
    WHEN (direction_part_type = 'ingredient'::product.direction_part_type) THEN ((comment_text IS NULL) AND (ingredient_id IS NOT NULL) AND (ingredient_amount IS NOT NULL))
    ELSE ((comment_text IS NOT NULL) AND (ingredient_id IS NULL) AND (ingredient_amount IS NULL))
END),
    CONSTRAINT direction_part_direction_fk FOREIGN KEY (direction_id) REFERENCES product.direction(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT direction_part_ingredient_fk FOREIGN KEY (ingredient_id) REFERENCES product.ingredient(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.direction_part OWNER TO postgres;
GRANT ALL ON TABLE product.direction_part TO postgres;