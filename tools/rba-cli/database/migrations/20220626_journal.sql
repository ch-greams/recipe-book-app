

CREATE TABLE journal.favorite_product (
    user_id int8 NOT NULL,
    product_id int8 NOT NULL,
    CONSTRAINT favorite_product_pk PRIMARY KEY (user_id, product_id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product.product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES journal."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE journal.favorite_product OWNER TO postgres;
GRANT ALL ON TABLE journal.favorite_product TO postgres;

