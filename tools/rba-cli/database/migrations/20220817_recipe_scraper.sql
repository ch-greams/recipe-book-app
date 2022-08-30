
CREATE SCHEMA recipe_scraper AUTHORIZATION postgres;


CREATE SEQUENCE recipe_scraper.ingredient_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE recipe_scraper.ingredient_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe_scraper.ingredient_id TO postgres;


CREATE SEQUENCE recipe_scraper.instruction_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE recipe_scraper.instruction_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe_scraper.instruction_id TO postgres;


CREATE SEQUENCE recipe_scraper.recipe_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE recipe_scraper.recipe_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe_scraper.recipe_id TO postgres;


CREATE SEQUENCE recipe_scraper.source_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE recipe_scraper.source_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe_scraper.source_id TO postgres;


CREATE SEQUENCE recipe_scraper.tag_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE recipe_scraper.tag_id OWNER TO postgres;
GRANT ALL ON SEQUENCE recipe_scraper.tag_id TO postgres;


CREATE TABLE recipe_scraper."source" (
	id int8 NOT NULL DEFAULT nextval('recipe_scraper.source_id'::regclass),
	"name" text NOT NULL,
	url text NOT NULL,
	CONSTRAINT source_name_unique UNIQUE (name),
	CONSTRAINT source_pk PRIMARY KEY (id)
);
ALTER TABLE recipe_scraper."source" OWNER TO postgres;
GRANT ALL ON TABLE recipe_scraper."source" TO postgres;


CREATE TABLE recipe_scraper.tag (
	id int8 NOT NULL DEFAULT nextval('recipe_scraper.tag_id'::regclass),
	"name" text NOT NULL,
	CONSTRAINT tag_name_unique UNIQUE (name),
	CONSTRAINT tag_pk PRIMARY KEY (id)
);
ALTER TABLE recipe_scraper.tag OWNER TO postgres;
GRANT ALL ON TABLE recipe_scraper.tag TO postgres;


CREATE TABLE recipe_scraper.recipe (
	id int8 NOT NULL DEFAULT nextval('recipe_scraper.recipe_id'::regclass),
	"name" text NULL,
	url text NOT NULL,
	source_id int8 NOT NULL,
	is_scraped bool NOT NULL DEFAULT false,
	"time" text NULL,
	servings text NULL,
	CONSTRAINT recipe_pk PRIMARY KEY (id),
	CONSTRAINT url_unique UNIQUE (url),
	CONSTRAINT source_id_fk FOREIGN KEY (source_id) REFERENCES recipe_scraper."source"(id)
);
ALTER TABLE recipe_scraper.recipe OWNER TO postgres;
GRANT ALL ON TABLE recipe_scraper.recipe TO postgres;


CREATE TABLE recipe_scraper.recipe_tag (
	recipe_id int8 NOT NULL,
	tag_id int8 NOT NULL,
	CONSTRAINT recipe_tag_pk PRIMARY KEY (recipe_id, tag_id),
	CONSTRAINT recipe_id_fk FOREIGN KEY (recipe_id) REFERENCES recipe_scraper.recipe(id),
	CONSTRAINT tag_id_fk FOREIGN KEY (tag_id) REFERENCES recipe_scraper.tag(id)
);
ALTER TABLE recipe_scraper.recipe_tag OWNER TO postgres;
GRANT ALL ON TABLE recipe_scraper.recipe_tag TO postgres;


CREATE TABLE recipe_scraper.ingredient (
	id int8 NOT NULL DEFAULT nextval('recipe_scraper.ingredient_id'::regclass),
	"text" text NOT NULL,
	recipe_id int8 NOT NULL,
	CONSTRAINT ingredient_pk PRIMARY KEY (id),
	CONSTRAINT recipe_id_fk FOREIGN KEY (recipe_id) REFERENCES recipe_scraper.recipe(id)
);
ALTER TABLE recipe_scraper.ingredient OWNER TO postgres;
GRANT ALL ON TABLE recipe_scraper.ingredient TO postgres;


CREATE TABLE recipe_scraper.instruction (
	id int8 NOT NULL DEFAULT nextval('recipe_scraper.instruction_id'::regclass),
	"order" int2 NOT NULL,
	"text" text NOT NULL,
	recipe_id int8 NOT NULL,
	CONSTRAINT instruction_pk PRIMARY KEY (id),
	CONSTRAINT recipe_id_fk FOREIGN KEY (recipe_id) REFERENCES recipe_scraper.recipe(id)
);
ALTER TABLE recipe_scraper.instruction OWNER TO postgres;
GRANT ALL ON TABLE recipe_scraper.instruction TO postgres;


CREATE OR REPLACE VIEW recipe_scraper.recipe_detailed
AS SELECT recipe.id,
    recipe.name,
    recipe."time",
    recipe.servings,
    recipe.url,
    ( SELECT array_agg(ingredient.text) AS ingredients
           FROM recipe_scraper.ingredient
          WHERE ingredient.recipe_id = recipe.id) AS ingredients,
    ( SELECT array_agg(instruction.text) AS instructions
           FROM recipe_scraper.instruction
          WHERE instruction.recipe_id = recipe.id) AS instructions
   FROM recipe_scraper.recipe recipe;
ALTER TABLE recipe_scraper.recipe_detailed OWNER TO postgres;
GRANT ALL ON TABLE recipe_scraper.recipe_detailed TO postgres;


GRANT ALL ON SCHEMA recipe_scraper TO postgres;
