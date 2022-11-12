
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

