

CREATE TABLE journal.favorite_product (
    user_id int8 NOT NULL,
    product_id int8 NOT NULL,
    CONSTRAINT favorite_product_pk PRIMARY KEY (user_id, product_id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE journal.favorite_product OWNER TO postgres;
GRANT ALL ON TABLE journal.favorite_product TO postgres;


CREATE SEQUENCE journal.journal_group_id
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
GRANT ALL ON SEQUENCE journal.journal_group_id TO postgres;


CREATE TABLE journal.journal_group (
	id int8 NOT NULL DEFAULT nextval('journal.journal_group_id'::regclass),
	"name" text NOT NULL,
	user_id int8 NOT NULL,
	CONSTRAINT journal_group_pk PRIMARY KEY (id),
	CONSTRAINT user_fk FOREIGN KEY (id) REFERENCES journal."user"(id)
);
ALTER TABLE journal.journal_group OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_group TO postgres;


CREATE TABLE journal.journal_entry (
	id int8 NOT NULL,
	user_id int8 NOT NULL,
	datetime date NOT NULL,
	product_id int8 NOT NULL,
	amount float4 NOT NULL,
	unit text NOT NULL,
	journal_group_id int8 NULL,
	CONSTRAINT journal_entry_pk PRIMARY KEY (id),
	CONSTRAINT journal_group_fk FOREIGN KEY (journal_group_id) REFERENCES journal.journal_group(id),
	CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product.product(id),
	CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id)
);
ALTER TABLE journal.journal_entry OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_entry TO postgres;
