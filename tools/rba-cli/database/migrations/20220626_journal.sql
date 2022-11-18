

CREATE TABLE journal.favorite_product (
    user_id int8 NOT NULL,
    product_id int8 NOT NULL,
    CONSTRAINT favorite_product_pk PRIMARY KEY (user_id, product_id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE journal.favorite_product OWNER TO postgres;
GRANT ALL ON TABLE journal.favorite_product TO postgres;


-- First 100 reserved for testing purposes
CREATE SEQUENCE journal.journal_entry_id
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 100
    CACHE 1
    NO CYCLE;
GRANT ALL ON SEQUENCE journal.journal_entry_id TO postgres;


CREATE TABLE journal.journal_group (
    order_number int2 NOT NULL,
    "name" text NOT NULL,
    user_id int8 NOT NULL,
    CONSTRAINT journal_group_pk PRIMARY KEY (order_number, user_id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id)
);
ALTER TABLE journal.journal_group OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_group TO postgres;


CREATE TABLE journal.journal_entry (
    id int8 NOT NULL DEFAULT nextval('journal.journal_entry_id'::regclass),
    user_id int8 NOT NULL,
    entry_date date NOT NULL,
    entry_time time NOT NULL,
    product_id int8 NOT NULL,
    amount float4 NOT NULL,
    unit text NOT NULL,
    journal_group_num int2 NULL,
    CONSTRAINT journal_entry_pk PRIMARY KEY (id),
    -- CONSTRAINT journal_group_fk FOREIGN KEY (journal_group_num,user_id) REFERENCES journal.journal_group(order_number,user_id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product.product(id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id)
);
ALTER TABLE journal.journal_entry OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_entry TO postgres;


CREATE OR REPLACE VIEW journal.journal_entry_product
AS SELECT journal_entry.id,
    journal_entry.user_id,
    journal_entry.entry_date,
    journal_entry.entry_time,
    journal_entry.product_id,
    journal_entry.amount,
    journal_entry.unit,
    journal_entry.journal_group_num,
    product.*::product.product AS product
   FROM journal.journal_entry journal_entry
   JOIN product.product product ON product.id = journal_entry.product_id;


ALTER TABLE journal.journal_entry_product OWNER TO postgres;
GRANT ALL ON TABLE journal.journal_entry_product TO postgres;
