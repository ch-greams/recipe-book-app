
CREATE SCHEMA journal AUTHORIZATION postgres;
GRANT ALL ON SCHEMA journal TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE journal.user_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
ALTER SEQUENCE journal.user_id OWNER TO postgres;
GRANT ALL ON SEQUENCE journal.user_id TO postgres;


CREATE TABLE journal."user" (
    id int8 NOT NULL DEFAULT nextval('journal.user_id'::regclass),
    email text NOT NULL,
    "password" text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    CONSTRAINT user_email_unique UNIQUE (email),
    CONSTRAINT user_pkey PRIMARY KEY (id)
);
ALTER TABLE journal."user" OWNER TO postgres;
GRANT ALL ON TABLE journal."user" TO postgres;


CREATE TABLE journal.user_nutrient (
	user_id int8 NOT NULL,
	nutrient_id int2 NOT NULL,
	is_featured bool NOT NULL DEFAULT false,
	daily_target_amount float4 NULL,
	CONSTRAINT user_nutrient_pk PRIMARY KEY (user_id, nutrient_id),
	CONSTRAINT nutrient_fk FOREIGN KEY (nutrient_id) REFERENCES meta.nutrient(id),
	CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id)
);
ALTER TABLE journal.user_nutrient OWNER TO postgres;
GRANT ALL ON TABLE journal.user_nutrient TO postgres;
