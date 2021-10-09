-- DROP SCHEMA private;

CREATE SCHEMA private AUTHORIZATION postgres;

-- DROP TYPE private."product_type";

CREATE TYPE private."product_type" AS ENUM (
	'food',
	'recipe');

-- DROP SEQUENCE private.direction_id;

CREATE SEQUENCE private.direction_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE private.direction_id OWNER TO postgres;
GRANT ALL ON SEQUENCE private.direction_id TO postgres;

-- DROP SEQUENCE private.ingredient_id;

CREATE SEQUENCE private.ingredient_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE private.ingredient_id OWNER TO postgres;
GRANT ALL ON SEQUENCE private.ingredient_id TO postgres;

-- DROP SEQUENCE private.product_id;

CREATE SEQUENCE private.product_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE private.product_id OWNER TO postgres;
GRANT ALL ON SEQUENCE private.product_id TO postgres;
-- private.product definition

-- Drop table

-- DROP TABLE private.product;

CREATE TABLE private.product (
	id int8 NOT NULL DEFAULT nextval('private.product_id'::regclass),
	"type" private."product_type" NOT NULL,
	"name" text NOT NULL,
	brand text NULL,
	subtitle text NULL,
	description text NULL,
	density float8 NULL DEFAULT 1,
	CONSTRAINT product_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE private.product OWNER TO postgres;
GRANT ALL ON TABLE private.product TO postgres;


-- private.custom_unit definition

-- Drop table

-- DROP TABLE private.custom_unit;

CREATE TABLE private.custom_unit (
	"name" text NOT NULL,
	amount float8 NOT NULL,
	unit text NOT NULL,
	product_id int8 NOT NULL,
	CONSTRAINT custom_unit_pk PRIMARY KEY (product_id, name),
	CONSTRAINT custom_unit_fk FOREIGN KEY (product_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE private.custom_unit OWNER TO postgres;
GRANT ALL ON TABLE private.custom_unit TO postgres;


-- private.direction definition

-- Drop table

-- DROP TABLE private.direction;

CREATE TABLE private.direction (
	recipe_id int8 NOT NULL,
	step_number int2 NOT NULL,
	"name" text NOT NULL,
	temperature private.temperature NULL,
	duration private.duration NULL,
	id int8 NOT NULL DEFAULT nextval('private.direction_id'::regclass),
	CONSTRAINT direction_pk PRIMARY KEY (recipe_id, step_number),
	CONSTRAINT direction_fk FOREIGN KEY (recipe_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE private.direction OWNER TO postgres;
GRANT ALL ON TABLE private.direction TO postgres;


-- private.direction_part definition

-- Drop table

-- DROP TABLE private.direction_part;

CREATE TABLE private.direction_part (
	direction_id int8 NOT NULL,
	step_number int2 NOT NULL,
	"type" text NOT NULL,
	"label" text NOT NULL,
	product_id int8 NULL,
	product_amount float8 NULL,
	CONSTRAINT direction_part_pk PRIMARY KEY (direction_id, step_number),
	CONSTRAINT direction_part_fk FOREIGN KEY (product_id) REFERENCES private.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE private.direction_part OWNER TO postgres;
GRANT ALL ON TABLE private.direction_part TO postgres;


-- private.ingredient definition

-- Drop table

-- DROP TABLE private.ingredient;

CREATE TABLE private.ingredient (
	id int8 NOT NULL DEFAULT nextval('private.ingredient_id'::regclass),
	recipe_id int8 NOT NULL,
	product_id int8 NOT NULL,
	CONSTRAINT ingredient_pk PRIMARY KEY (id),
	CONSTRAINT ingredient_fk FOREIGN KEY (product_id) REFERENCES private.ingredient(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE private.ingredient OWNER TO postgres;
GRANT ALL ON TABLE private.ingredient TO postgres;


-- private.ingredient_product definition

-- Drop table

-- DROP TABLE private.ingredient_product;

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

-- Permissions

ALTER TABLE private.ingredient_product OWNER TO postgres;
GRANT ALL ON TABLE private.ingredient_product TO postgres;


-- private.nutrition_fact definition

-- Drop table

-- DROP TABLE private.nutrition_fact;

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

-- Permissions

ALTER TABLE private.nutrition_fact OWNER TO postgres;
GRANT ALL ON TABLE private.nutrition_fact TO postgres;




-- Permissions

GRANT ALL ON SCHEMA private TO postgres;
