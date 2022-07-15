CREATE SCHEMA usda AUTHORIZATION postgres;

CREATE TABLE usda.nutrient (
	id int8 NOT NULL,
	"name" text NOT NULL,
	unit_name text NOT NULL,
	nutrient_nbr text NULL,
	"rank" float8 NULL,
	CONSTRAINT nutrient_pkey PRIMARY KEY (id)
);
ALTER TABLE usda.nutrient OWNER TO postgres;
GRANT ALL ON TABLE usda.nutrient TO postgres;

GRANT ALL ON SCHEMA usda TO postgres;
