
CREATE SCHEMA private AUTHORIZATION postgres;

CREATE TYPE private."direction_part_type" AS ENUM ('ingredient', 'note', 'warning', 'tip');
CREATE TYPE private."product_type" AS ENUM ('food', 'recipe');


CREATE SEQUENCE private.direction_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE private.direction_id OWNER TO postgres;
GRANT ALL ON SEQUENCE private.direction_id TO postgres;


CREATE SEQUENCE private.ingredient_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE private.ingredient_id OWNER TO postgres;
GRANT ALL ON SEQUENCE private.ingredient_id TO postgres;


CREATE SEQUENCE private.product_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE private.product_id OWNER TO postgres;
GRANT ALL ON SEQUENCE private.product_id TO postgres;


CREATE SEQUENCE private.user_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE private.user_id OWNER TO postgres;
GRANT ALL ON SEQUENCE private.user_id TO postgres;


CREATE TABLE private."user" (
	id int8 NOT NULL DEFAULT nextval('private.user_id'::regclass),
	email text NOT NULL,
	"password" text NOT NULL,
	first_name text NOT NULL,
	last_name text NOT NULL,
	CONSTRAINT user_email_unique UNIQUE (email),
	CONSTRAINT user_pkey PRIMARY KEY (id)
);
ALTER TABLE private."user" OWNER TO postgres;
GRANT ALL ON TABLE private."user" TO postgres;


CREATE TABLE private.product (
	id int8 NOT NULL DEFAULT nextval('private.product_id'::regclass),
	"type" private."product_type" NOT NULL,
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
	CONSTRAINT created_by_fk FOREIGN KEY (created_by) REFERENCES private."user"(id)
);
ALTER TABLE private.product OWNER TO postgres;
GRANT ALL ON TABLE private.product TO postgres;


CREATE TABLE private.custom_unit (
	"name" text NOT NULL,
	amount float8 NOT NULL,
	unit text NOT NULL,
	product_id int8 NOT NULL,
	CONSTRAINT custom_unit_pk PRIMARY KEY (product_id, name),
	CONSTRAINT custom_unit_fk FOREIGN KEY (product_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE private.custom_unit OWNER TO postgres;
GRANT ALL ON TABLE private.custom_unit TO postgres;


CREATE TABLE private.direction (
	recipe_id int8 NOT NULL,
	step_number int2 NOT NULL,
	"name" text NOT NULL,
	id int8 NOT NULL DEFAULT nextval('private.direction_id'::regclass),
	temperature_value int2 NULL,
	temperature_unit text NOT NULL DEFAULT 'C'::text,
	duration_value int4 NULL,
	duration_unit text NOT NULL DEFAULT 'min'::text,
	CONSTRAINT direction_pk PRIMARY KEY (id),
	CONSTRAINT recipe_step_uq UNIQUE (recipe_id, step_number),
	CONSTRAINT direction_fk FOREIGN KEY (recipe_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE private.direction OWNER TO postgres;
GRANT ALL ON TABLE private.direction TO postgres;


CREATE TABLE private.favorite_product (
	user_id int8 NOT NULL,
	product_id int8 NOT NULL,
	CONSTRAINT favorite_product_pk PRIMARY KEY (user_id, product_id),
	CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES private."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE private.favorite_product OWNER TO postgres;
GRANT ALL ON TABLE private.favorite_product TO postgres;


CREATE TABLE private.ingredient (
	id int8 NOT NULL DEFAULT nextval('private.ingredient_id'::regclass),
	recipe_id int8 NOT NULL,
	product_id int8 NULL,
	CONSTRAINT ingredient_pk PRIMARY KEY (id),
	CONSTRAINT ingredient_product_fk FOREIGN KEY (product_id) REFERENCES private.product(id),
	CONSTRAINT ingredient_recipe_fk FOREIGN KEY (recipe_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE private.ingredient OWNER TO postgres;
GRANT ALL ON TABLE private.ingredient TO postgres;


CREATE TABLE private.ingredient_product (
	ingredient_id int8 NOT NULL,
	product_id int8 NOT NULL,
	amount float8 NOT NULL,
	unit text NOT NULL,
	CONSTRAINT ingredient_product_pk PRIMARY KEY (ingredient_id, product_id),
	CONSTRAINT ingredient_product_ingredient_fk FOREIGN KEY (ingredient_id) REFERENCES private.ingredient(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT ingredient_product_product_fk FOREIGN KEY (product_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX fki_ingredient_product_ingredient_fk ON private.ingredient_product USING btree (ingredient_id);
CREATE INDEX fki_ingredient_product_product_fk ON private.ingredient_product USING btree (product_id);
ALTER TABLE private.ingredient_product OWNER TO postgres;
GRANT ALL ON TABLE private.ingredient_product TO postgres;


CREATE TABLE private.nutrition_fact (
	product_id int8 NOT NULL,
	energy float8 NULL,
	carbohydrate float8 NULL,
	dietary_fiber float8 NULL,
	starch float8 NULL,
	sugars float8 NULL,
	fat float8 NULL,
	monounsaturated float8 NULL,
	polyunsaturated float8 NULL,
	omega_3 float8 NULL,
	omega_6 float8 NULL,
	saturated float8 NULL,
	trans_fats float8 NULL,
	cholesterol float8 NULL,
	phytosterol float8 NULL,
	protein float8 NULL,
	tryptophan float8 NULL,
	threonine float8 NULL,
	isoleucine float8 NULL,
	leucine float8 NULL,
	lysine float8 NULL,
	methionine float8 NULL,
	cystine float8 NULL,
	phenylalanine float8 NULL,
	tyrosine float8 NULL,
	valine float8 NULL,
	arginine float8 NULL,
	histidine float8 NULL,
	alanine float8 NULL,
	aspartic_acid float8 NULL,
	glutamic_acid float8 NULL,
	glycine float8 NULL,
	proline float8 NULL,
	serine float8 NULL,
	hydroxyproline float8 NULL,
	vitamin_a float8 NULL,
	vitamin_c float8 NULL,
	vitamin_d float8 NULL,
	vitamin_e float8 NULL,
	vitamin_k float8 NULL,
	vitamin_b1 float8 NULL,
	vitamin_b2 float8 NULL,
	vitamin_b3 float8 NULL,
	vitamin_b5 float8 NULL,
	vitamin_b6 float8 NULL,
	vitamin_b9 float8 NULL,
	vitamin_b12 float8 NULL,
	choline float8 NULL,
	betaine float8 NULL,
	calcium float8 NULL,
	iron float8 NULL,
	magnesium float8 NULL,
	phosphorus float8 NULL,
	potassium float8 NULL,
	sodium float8 NULL,
	zinc float8 NULL,
	copper float8 NULL,
	manganese float8 NULL,
	selenium float8 NULL,
	fluoride float8 NULL,
	chromium float8 NULL,
	iodine float8 NULL,
	molybdenum float8 NULL,
	alcohol float8 NULL,
	water float8 NULL,
	ash float8 NULL,
	caffeine float8 NULL,
	CONSTRAINT nutrition_fact_pk PRIMARY KEY (product_id),
	CONSTRAINT nutrition_fact_fk FOREIGN KEY (product_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE private.nutrition_fact OWNER TO postgres;
GRANT ALL ON TABLE private.nutrition_fact TO postgres;


CREATE TABLE private.direction_part (
	direction_id int8 NOT NULL,
	step_number int2 NOT NULL,
	"direction_part_type" private."direction_part_type" NOT NULL,
	comment_text text NULL,
	ingredient_id int8 NULL,
	ingredient_amount float8 NULL,
	CONSTRAINT direction_part_ingredient_amount_check CHECK (((ingredient_amount > (0)::double precision) AND (ingredient_amount <= (1)::double precision))) NOT VALID,
	CONSTRAINT direction_part_pk PRIMARY KEY (direction_id, step_number),
	CONSTRAINT direction_part_type_check CHECK (
CASE
    WHEN (direction_part_type = 'ingredient'::private.direction_part_type) THEN ((comment_text IS NULL) AND (ingredient_id IS NOT NULL) AND (ingredient_amount IS NOT NULL))
    ELSE ((comment_text IS NOT NULL) AND (ingredient_id IS NULL) AND (ingredient_amount IS NULL))
END),
	CONSTRAINT direction_part_direction_fk FOREIGN KEY (direction_id) REFERENCES private.direction(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT direction_part_ingredient_fk FOREIGN KEY (ingredient_id) REFERENCES private.ingredient(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE private.direction_part OWNER TO postgres;
GRANT ALL ON TABLE private.direction_part TO postgres;


CREATE OR REPLACE VIEW private.ingredient_product_details
AS SELECT ingredient_product.ingredient_id,
    ingredient_product.product_id,
    ingredient_product.amount,
    ingredient_product.unit,
    product.type AS product_type,
    product.name,
    product.density,
    nutrition_fact.*::private.nutrition_fact AS nutrition_facts
   FROM private.ingredient_product ingredient_product
     LEFT JOIN private.product product ON product.id = ingredient_product.product_id
     LEFT JOIN private.nutrition_fact nutrition_fact ON nutrition_fact.product_id = ingredient_product.product_id;
ALTER TABLE private.ingredient_product_details OWNER TO postgres;
GRANT ALL ON TABLE private.ingredient_product_details TO postgres;


GRANT ALL ON SCHEMA private TO postgres;