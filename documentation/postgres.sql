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
	product_id int8 NULL,
	CONSTRAINT ingredient_pk PRIMARY KEY (id),
	CONSTRAINT ingredient_fk FOREIGN KEY (product_id) REFERENCES private.product(id)
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


-- private.food_json source

CREATE OR REPLACE VIEW private.food_json
AS WITH food AS (
         SELECT product.id,
            product.name,
            product.brand,
            product.subtitle,
            product.density
           FROM private.product
          WHERE product.type = 'food'::private.product_type
        ), custom_unit AS (
         SELECT custom_unit.product_id,
            json_agg(json_build_object('name', custom_unit.name, 'amount', custom_unit.amount, 'unit', custom_unit.unit)) AS json
           FROM private.custom_unit
          GROUP BY custom_unit.product_id
        ), nutrition_fact AS (
         SELECT nutrition_fact.product_id,
            jsonb_build_object('energy', nutrition_fact.energy) AS group_energy,
            jsonb_build_object('carbohydrate', nutrition_fact.carbohydrate, 'dietary_fiber', nutrition_fact.dietary_fiber, 'starch', nutrition_fact.starch, 'sugars', nutrition_fact.sugars) AS group_carbohydrate,
            jsonb_build_object('fat', nutrition_fact.fat, 'monounsaturated', nutrition_fact.monounsaturated, 'polyunsaturated', nutrition_fact.polyunsaturated, 'omega_3', nutrition_fact.omega_3, 'omega_6', nutrition_fact.omega_6, 'saturated', nutrition_fact.saturated, 'trans_fats', nutrition_fact.trans_fats, 'cholesterol', nutrition_fact.cholesterol, 'phytosterol', nutrition_fact.phytosterol) AS group_fat,
            jsonb_build_object('protein', nutrition_fact.protein, 'tryptophan', nutrition_fact.tryptophan, 'threonine', nutrition_fact.threonine, 'isoleucine', nutrition_fact.isoleucine, 'leucine', nutrition_fact.leucine, 'lysine', nutrition_fact.lysine, 'methionine', nutrition_fact.methionine, 'cystine', nutrition_fact.cystine, 'phenylalanine', nutrition_fact.phenylalanine, 'tyrosine', nutrition_fact.tyrosine, 'valine', nutrition_fact.valine, 'arginine', nutrition_fact.arginine, 'histidine', nutrition_fact.histidine, 'alanine', nutrition_fact.alanine, 'aspartic_acid', nutrition_fact.aspartic_acid, 'glutamic_acid', nutrition_fact.glutamic_acid, 'glycine', nutrition_fact.glycine, 'proline', nutrition_fact.proline, 'serine', nutrition_fact.serine, 'hydroxyproline', nutrition_fact.hydroxyproline) AS group_protein,
            jsonb_build_object('vitamin_a', nutrition_fact.vitamin_a, 'vitamin_c', nutrition_fact.vitamin_c, 'vitamin_d', nutrition_fact.vitamin_d, 'vitamin_e', nutrition_fact.vitamin_e, 'vitamin_k', nutrition_fact.vitamin_k, 'vitamin_b1', nutrition_fact.vitamin_b1, 'vitamin_b2', nutrition_fact.vitamin_b2, 'vitamin_b3', nutrition_fact.vitamin_b3, 'vitamin_b5', nutrition_fact.vitamin_b5, 'vitamin_b6', nutrition_fact.vitamin_b6, 'vitamin_b9', nutrition_fact.vitamin_b9, 'vitamin_b12', nutrition_fact.vitamin_b12, 'choline', nutrition_fact.choline, 'betaine', nutrition_fact.betaine, 'calcium', nutrition_fact.calcium, 'iron', nutrition_fact.iron, 'magnesium', nutrition_fact.magnesium, 'phosphorus', nutrition_fact.phosphorus, 'potassium', nutrition_fact.potassium, 'sodium', nutrition_fact.sodium, 'zinc', nutrition_fact.zinc, 'copper', nutrition_fact.copper, 'manganese', nutrition_fact.manganese, 'selenium', nutrition_fact.selenium, 'fluoride', nutrition_fact.fluoride, 'chromium', nutrition_fact.chromium, 'iodine', nutrition_fact.iodine, 'molybdenum', nutrition_fact.molybdenum) AS group_vitamin,
            jsonb_build_object('alcohol', nutrition_fact.alcohol, 'water', nutrition_fact.water, 'ash', nutrition_fact.ash, 'caffeine', nutrition_fact.caffeine) AS group_other
           FROM private.nutrition_fact
        )
 SELECT food.id,
    json_build_object('id', food.id, 'name', food.name, 'brand', food.brand, 'subtitle', food.subtitle, 'density', food.density, 'nutritionFacts', ( SELECT ((((nutrition_fact.group_energy || nutrition_fact.group_carbohydrate) || nutrition_fact.group_fat) || nutrition_fact.group_protein) || nutrition_fact.group_vitamin) || nutrition_fact.group_other
           FROM nutrition_fact
          WHERE nutrition_fact.product_id = food.id), 'customUnits', COALESCE(( SELECT custom_unit.json
           FROM custom_unit
          WHERE custom_unit.product_id = food.id), '[]'::json)) AS json
   FROM food;

-- Permissions

ALTER TABLE private.food_json OWNER TO postgres;
GRANT ALL ON TABLE private.food_json TO postgres;


-- private.nutrition_fact_json source

CREATE OR REPLACE VIEW private.nutrition_fact_json
AS WITH nutrition_fact AS (
         SELECT nutrition_fact_1.product_id,
            jsonb_build_object('energy', nutrition_fact_1.energy) AS group_energy,
            jsonb_build_object('carbohydrate', nutrition_fact_1.carbohydrate, 'dietary_fiber', nutrition_fact_1.dietary_fiber, 'starch', nutrition_fact_1.starch, 'sugars', nutrition_fact_1.sugars) AS group_carbohydrate,
            jsonb_build_object('fat', nutrition_fact_1.fat, 'monounsaturated', nutrition_fact_1.monounsaturated, 'polyunsaturated', nutrition_fact_1.polyunsaturated, 'omega_3', nutrition_fact_1.omega_3, 'omega_6', nutrition_fact_1.omega_6, 'saturated', nutrition_fact_1.saturated, 'trans_fats', nutrition_fact_1.trans_fats, 'cholesterol', nutrition_fact_1.cholesterol, 'phytosterol', nutrition_fact_1.phytosterol) AS group_fat,
            jsonb_build_object('protein', nutrition_fact_1.protein, 'tryptophan', nutrition_fact_1.tryptophan, 'threonine', nutrition_fact_1.threonine, 'isoleucine', nutrition_fact_1.isoleucine, 'leucine', nutrition_fact_1.leucine, 'lysine', nutrition_fact_1.lysine, 'methionine', nutrition_fact_1.methionine, 'cystine', nutrition_fact_1.cystine, 'phenylalanine', nutrition_fact_1.phenylalanine, 'tyrosine', nutrition_fact_1.tyrosine, 'valine', nutrition_fact_1.valine, 'arginine', nutrition_fact_1.arginine, 'histidine', nutrition_fact_1.histidine, 'alanine', nutrition_fact_1.alanine, 'aspartic_acid', nutrition_fact_1.aspartic_acid, 'glutamic_acid', nutrition_fact_1.glutamic_acid, 'glycine', nutrition_fact_1.glycine, 'proline', nutrition_fact_1.proline, 'serine', nutrition_fact_1.serine, 'hydroxyproline', nutrition_fact_1.hydroxyproline) AS group_protein,
            jsonb_build_object('vitamin_a', nutrition_fact_1.vitamin_a, 'vitamin_c', nutrition_fact_1.vitamin_c, 'vitamin_d', nutrition_fact_1.vitamin_d, 'vitamin_e', nutrition_fact_1.vitamin_e, 'vitamin_k', nutrition_fact_1.vitamin_k, 'vitamin_b1', nutrition_fact_1.vitamin_b1, 'vitamin_b2', nutrition_fact_1.vitamin_b2, 'vitamin_b3', nutrition_fact_1.vitamin_b3, 'vitamin_b5', nutrition_fact_1.vitamin_b5, 'vitamin_b6', nutrition_fact_1.vitamin_b6, 'vitamin_b9', nutrition_fact_1.vitamin_b9, 'vitamin_b12', nutrition_fact_1.vitamin_b12, 'choline', nutrition_fact_1.choline, 'betaine', nutrition_fact_1.betaine, 'calcium', nutrition_fact_1.calcium, 'iron', nutrition_fact_1.iron, 'magnesium', nutrition_fact_1.magnesium, 'phosphorus', nutrition_fact_1.phosphorus, 'potassium', nutrition_fact_1.potassium, 'sodium', nutrition_fact_1.sodium, 'zinc', nutrition_fact_1.zinc, 'copper', nutrition_fact_1.copper, 'manganese', nutrition_fact_1.manganese, 'selenium', nutrition_fact_1.selenium, 'fluoride', nutrition_fact_1.fluoride, 'chromium', nutrition_fact_1.chromium, 'iodine', nutrition_fact_1.iodine, 'molybdenum', nutrition_fact_1.molybdenum) AS group_vitamin,
            jsonb_build_object('alcohol', nutrition_fact_1.alcohol, 'water', nutrition_fact_1.water, 'ash', nutrition_fact_1.ash, 'caffeine', nutrition_fact_1.caffeine) AS group_other
           FROM private.nutrition_fact nutrition_fact_1
        )
 SELECT nutrition_fact.product_id,
    ((((nutrition_fact.group_energy || nutrition_fact.group_carbohydrate) || nutrition_fact.group_fat) || nutrition_fact.group_protein) || nutrition_fact.group_vitamin) || nutrition_fact.group_other AS json
   FROM nutrition_fact;

-- Permissions

ALTER TABLE private.nutrition_fact_json OWNER TO postgres;
GRANT ALL ON TABLE private.nutrition_fact_json TO postgres;


-- private.recipe_json source

CREATE OR REPLACE VIEW private.recipe_json
AS WITH recipe AS (
         SELECT product.id,
            product.name,
            product.brand,
            product.subtitle,
            product.density
           FROM private.product
          WHERE product.type = 'recipe'::private.product_type
        ), custom_unit AS (
         SELECT custom_unit.product_id,
            json_agg(json_build_object('name', custom_unit.name, 'amount', custom_unit.amount, 'unit', custom_unit.unit)) AS json
           FROM private.custom_unit
          GROUP BY custom_unit.product_id
        ), ingredient_product AS (
         SELECT ingredient_product.ingredient_id,
            json_object_agg(ingredient_product.product_id, json_build_object('id', ingredient_product.product_id, 'type', ( SELECT product.type
                   FROM private.product
                  WHERE product.id = ingredient_product.product_id), 'name', ( SELECT product.name
                   FROM private.product
                  WHERE product.id = ingredient_product.product_id), 'amount', ingredient_product.amount, 'unit', ingredient_product.unit, 'nutritionFacts', ( SELECT nutrition_fact_json.json
                   FROM private.nutrition_fact_json
                  WHERE nutrition_fact_json.product_id = ingredient_product.product_id))) AS json
           FROM private.ingredient_product
          GROUP BY ingredient_product.ingredient_id
        ), ingredient AS (
         SELECT ingredient.recipe_id,
            json_agg(json_build_object('id', ingredient.id, 'product_id', ingredient.product_id, 'products', ( SELECT ingredient_product.json
                   FROM ingredient_product
                  WHERE ingredient_product.ingredient_id = ingredient.id))) AS json
           FROM private.ingredient
          GROUP BY ingredient.recipe_id
        )
 SELECT recipe.id,
    json_build_object('id', recipe.id, 'name', recipe.name, 'brand', recipe.brand, 'subtitle', recipe.subtitle, 'density', recipe.density, 'customUnits', COALESCE(( SELECT custom_unit.json
           FROM custom_unit
          WHERE custom_unit.product_id = recipe.id), '[]'::json), 'ingredients', ( SELECT ingredient.json
           FROM ingredient
          WHERE ingredient.recipe_id = recipe.id), 'directions', '[]'::json) AS json
   FROM recipe;

-- Permissions

ALTER TABLE private.recipe_json OWNER TO postgres;
GRANT ALL ON TABLE private.recipe_json TO postgres;




-- Permissions

GRANT ALL ON SCHEMA private TO postgres;
