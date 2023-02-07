
CREATE SCHEMA product AUTHORIZATION postgres;
GRANT ALL ON SCHEMA product TO postgres;


CREATE TYPE product."direction_part_type" AS ENUM ('ingredient', 'note', 'warning', 'tip');


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
    order_number int2 NOT NULL,
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
    id int8 NOT NULL DEFAULT nextval('product.product_nutrient_id'::regclass),
    nutrient_id int2 NOT NULL,
    product_id int8 NOT NULL,
    amount float4 NOT NULL,
    CONSTRAINT product_nutrient_pk PRIMARY KEY (id),
    CONSTRAINT product_nutrient_un UNIQUE (nutrient_id, product_id),
    CONSTRAINT nutrient_id_fk FOREIGN KEY (nutrient_id) REFERENCES meta.nutrient(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT product_id_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX product_nutrient_product_id_idx ON product.product_nutrient USING btree (product_id);
ALTER TABLE product.product_nutrient OWNER TO postgres;
GRANT ALL ON TABLE product.product_nutrient TO postgres;


CREATE TABLE product.direction_part (
    direction_id int8 NOT NULL,
    step_number int2 NOT NULL,
    "direction_part_type" product."direction_part_type" NOT NULL,
    comment_text text NULL,
    ingredient_number int2 NULL,
    ingredient_amount float8 NULL,
    CONSTRAINT direction_part_ingredient_amount_check CHECK (((ingredient_amount > (0)::double precision) AND (ingredient_amount <= (1)::double precision))) NOT VALID,
    CONSTRAINT direction_part_pk PRIMARY KEY (direction_id, step_number),
    CONSTRAINT direction_part_direction_fk FOREIGN KEY (direction_id) REFERENCES product.direction(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE product.direction_part OWNER TO postgres;
GRANT ALL ON TABLE product.direction_part TO postgres;

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
    i.order_number,
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
