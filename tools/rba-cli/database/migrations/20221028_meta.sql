
CREATE SCHEMA meta AUTHORIZATION postgres;


CREATE SEQUENCE meta.nutrient_group_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE meta.nutrient_group_id OWNER TO postgres;
GRANT ALL ON SEQUENCE meta.nutrient_group_id TO postgres;


CREATE SEQUENCE meta.nutrient_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE meta.nutrient_id OWNER TO postgres;
GRANT ALL ON SEQUENCE meta.nutrient_id TO postgres;


CREATE TABLE meta.nutrient_group (
	id int8 NOT NULL DEFAULT nextval('meta.nutrient_group_id'::regclass),
	"name" text NOT NULL,
	CONSTRAINT nutrient_group_pk PRIMARY KEY (id)
);
ALTER TABLE meta.nutrient_group OWNER TO postgres;
GRANT ALL ON TABLE meta.nutrient_group TO postgres;


CREATE TABLE meta.nutrient (
	id int8 NOT NULL DEFAULT nextval('meta.nutrient_id'::regclass),
	"name" text NOT NULL,
	daily_value float4 NULL,
	unit text NOT NULL,
	nutrient_group_id int8 NOT NULL,
	parent_id int8 NULL,
	CONSTRAINT nutrient_name_un UNIQUE (name),
	CONSTRAINT nutrient_pk PRIMARY KEY (id),
	CONSTRAINT nutrient_group_id_fk FOREIGN KEY (nutrient_group_id) REFERENCES meta.nutrient_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT parent_id_fk FOREIGN KEY (parent_id) REFERENCES meta.nutrient(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE meta.nutrient OWNER TO postgres;
GRANT ALL ON TABLE meta.nutrient TO postgres;


CREATE MATERIALIZED VIEW meta.nutrient_details
TABLESPACE pg_default
AS SELECT nutrient.id,
    nutrient.name,
    nutrient.daily_value,
    nutrient.unit,
    nutrient_group.name AS nutrient_group,
    nutrient_parent.name AS parent_name
   FROM meta.nutrient nutrient
     JOIN meta.nutrient_group nutrient_group ON nutrient_group.id = nutrient.nutrient_group_id
     LEFT JOIN meta.nutrient nutrient_parent ON nutrient_parent.id = nutrient.parent_id
WITH DATA;
ALTER TABLE meta.nutrient_details OWNER TO postgres;
GRANT ALL ON TABLE meta.nutrient_details TO postgres;


GRANT ALL ON SCHEMA meta TO postgres;
