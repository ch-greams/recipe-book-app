
CREATE SCHEMA usda AUTHORIZATION postgres


CREATE TABLE usda.food_category (
	id int8 NOT NULL,
	code text NULL,
	description text NULL,
	CONSTRAINT food_category_pk PRIMARY KEY (id)
);
ALTER TABLE usda.food_category OWNER TO postgres;
GRANT ALL ON TABLE usda.food_category TO postgres;


CREATE TABLE usda.measure_unit (
	id int8 NOT NULL,
	"name" text NULL,
	CONSTRAINT measure_unit_pk PRIMARY KEY (id)
);
ALTER TABLE usda.measure_unit OWNER TO postgres;
GRANT ALL ON TABLE usda.measure_unit TO postgres;


CREATE TABLE usda.nutrient (
	id int8 NOT NULL,
	"name" text NOT NULL,
	unit_name text NOT NULL,
	nutrient_nbr text NULL,
	"rank" float8 NULL,
	CONSTRAINT nutrient_pk PRIMARY KEY (id)
);
COMMENT ON TABLE usda.nutrient IS 'id (> 1000) and nutrient_ndr (< 1000) used somewhat interchangably';
ALTER TABLE usda.nutrient OWNER TO postgres;
GRANT ALL ON TABLE usda.nutrient TO postgres;


CREATE TABLE usda.retention_factor (
	id int8 NOT NULL,
	code int8 NOT NULL,
	food_group_id int8 NOT NULL,
	description text NOT NULL,
	CONSTRAINT retention_factor_code_un UNIQUE (code),
	CONSTRAINT retention_factor_pk PRIMARY KEY (id)
);
ALTER TABLE usda.retention_factor OWNER TO postgres;
GRANT ALL ON TABLE usda.retention_factor TO postgres;


CREATE TABLE usda.wweia_food_category (
	wweia_food_category int8 NOT NULL,
	wweia_food_category_description text NULL,
	CONSTRAINT wweia_food_category_pk PRIMARY KEY (wweia_food_category)
);
ALTER TABLE usda.wweia_food_category OWNER TO postgres;
GRANT ALL ON TABLE usda.wweia_food_category TO postgres;


CREATE TABLE usda.food (
	fdc_id int8 NOT NULL,
	data_type text NULL,
	description text NULL,
	food_category_id int8 NULL,
	publication_date date NULL,
	CONSTRAINT food_pk PRIMARY KEY (fdc_id),
	CONSTRAINT wweia_food_category_fk FOREIGN KEY (food_category_id) REFERENCES usda.wweia_food_category(wweia_food_category) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE usda.food OWNER TO postgres;
GRANT ALL ON TABLE usda.food TO postgres;


CREATE TABLE usda.food_component (
	id int8 NOT NULL,
	fdc_id int8 NOT NULL,
	"name" text NULL,
	pct_weight float8 NULL,
	is_refuse bool NULL,
	gram_weight float8 NULL,
	data_points int4 NULL,
	min_year_acquired int4 NULL,
	CONSTRAINT food_component_pk PRIMARY KEY (id),
	CONSTRAINT food_component_fk FOREIGN KEY (fdc_id) REFERENCES usda.food(fdc_id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE usda.food_component OWNER TO postgres;
GRANT ALL ON TABLE usda.food_component TO postgres;


CREATE TABLE usda.food_nutrient (
	id int8 NOT NULL,
	fdc_id int8 NOT NULL,
	nutrient_id int8 NULL,
	amount float8 NULL,
	data_points int4 NULL,
	derivation_id int4 NULL,
	min float8 NULL,
	max float8 NULL,
	median float8 NULL,
	footnote text NULL,
	min_year_acquired int4 NULL,
	CONSTRAINT food_nutrient_pk PRIMARY KEY (id),
	CONSTRAINT food_fk FOREIGN KEY (fdc_id) REFERENCES usda.food(fdc_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT nutrient_fk FOREIGN KEY (nutrient_id) REFERENCES usda.nutrient(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE usda.food_nutrient OWNER TO postgres;
GRANT ALL ON TABLE usda.food_nutrient TO postgres;


CREATE TABLE usda.food_portion (
	id int8 NOT NULL,
	fdc_id int8 NOT NULL,
	seq_num int4 NULL,
	amount float8 NULL,
	measure_unit_id int4 NOT NULL,
	portion_description text NULL,
	modifier text NULL,
	gram_weight float8 NULL,
	data_points int4 NULL,
	footnote text NULL,
	min_year_acquired int4 NULL,
	CONSTRAINT food_portion_pk PRIMARY KEY (id),
	CONSTRAINT food_fk FOREIGN KEY (fdc_id) REFERENCES usda.food(fdc_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT measure_unit_fk FOREIGN KEY (measure_unit_id) REFERENCES usda.measure_unit(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE usda.food_portion OWNER TO postgres;
GRANT ALL ON TABLE usda.food_portion TO postgres;


CREATE TABLE usda.foundation_food (
	fdc_id int8 NOT NULL,
	ndb_number int8 NULL,
	footnote text NULL,
	CONSTRAINT foundation_food_pk PRIMARY KEY (fdc_id),
	CONSTRAINT foundation_food_fk FOREIGN KEY (fdc_id) REFERENCES usda.food(fdc_id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE usda.foundation_food OWNER TO postgres;
GRANT ALL ON TABLE usda.foundation_food TO postgres;


CREATE TABLE usda.input_food (
	id int4 NOT NULL,
	fdc_id int8 NOT NULL,
	fdc_id_of_input_food int8 NULL,
	seq_num int4 NULL,
	amount float8 NULL,
	sr_code int8 NULL,
	sr_description text NULL,
	unit text NULL,
	portion_code int8 NULL,
	portion_description text NULL,
	gram_weight float8 NULL,
	retention_code int8 NULL,
	survey_flag text NULL,
	CONSTRAINT input_food_pk PRIMARY KEY (id),
	CONSTRAINT food_fk FOREIGN KEY (fdc_id) REFERENCES usda.food(fdc_id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE usda.input_food OWNER TO postgres;
GRANT ALL ON TABLE usda.input_food TO postgres;


CREATE TABLE usda.survey_fndds_food (
	fdc_id int8 NOT NULL,
	food_code int8 NULL,
	wweia_category_code int8 NOT NULL,
	start_date text NULL,
	end_date text NULL,
	CONSTRAINT survey_fndds_food_pk PRIMARY KEY (fdc_id),
	CONSTRAINT food_fk FOREIGN KEY (fdc_id) REFERENCES usda.food(fdc_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT wweia_food_category_fk FOREIGN KEY (wweia_category_code) REFERENCES usda.wweia_food_category(wweia_food_category) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE usda.survey_fndds_food OWNER TO postgres;
GRANT ALL ON TABLE usda.survey_fndds_food TO postgres;


CREATE TABLE usda.branded_food (
	fdc_id int8 NOT NULL,
	brand_owner text NULL,
	brand_name text NULL,
	subbrand_name text NULL,
	gtin_upc text NULL,
	ingredients text NULL,
	not_a_significant_source_of text NULL,
	serving_size float8 NULL,
	serving_size_unit text NULL,
	household_serving_fulltext text NULL,
	branded_food_category text NULL,
	data_source text NULL,
	package_weight text NULL,
	modified_date date NULL,
	available_date date NULL,
	market_country text NULL,
	discontinued_date date NULL,
	preparation_state_code text NULL,
	trade_channel text NULL,
	CONSTRAINT branded_food_pk PRIMARY KEY (fdc_id),
	CONSTRAINT food_fk FOREIGN KEY (fdc_id) REFERENCES usda.food(fdc_id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE usda.branded_food OWNER TO postgres;
GRANT ALL ON TABLE usda.branded_food TO postgres;
