CREATE TABLE IF NOT EXISTS public.tbl_roles
(
    rol_id varchar(5) COLLATE pg_catalog."default" NOT NULL,
    rol_name varchar(5) COLLATE pg_catalog."default",
	role_status integer DEFAULT 0,
    rol_create_date date,
    rol_update_date date,
    CONSTRAINT tbl_roles_pkey PRIMARY KEY (rol_id)
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_roles
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_categories
(
    cate_id varchar(5) COLLATE pg_catalog."default" NOT NULL,
    cate_name varchar(100) COLLATE pg_catalog."default",
	cate_status integer DEFAULT 0,
	cate_father varchar(5),
    cate_created_date date,
    cate_updated_date date,
    CONSTRAINT tbl_categiries_pkey PRIMARY KEY (cate_id)
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_categories
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_product
(
    prod_id integer NOT NULL,
    prod_name varchar(60) COLLATE pg_catalog."default",
    prod_category_id varchar(5) COLLATE pg_catalog."default",
    prod_amount integer,
    prod_created_date date,
    prod_updated_date date,
    prod_price varchar(100) COLLATE pg_catalog."default",
	prod_status integer DEFAULT 0,
    CONSTRAINT tbl_product_pkey PRIMARY KEY (prod_id),
    CONSTRAINT tbl_product_categories_fkey FOREIGN KEY (prod_category_id)
        REFERENCES public.tbl_categories (cate_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_product
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_account
(
    acc_id integer NOT NULL,
    acc_username varchar(100) COLLATE pg_catalog."default",
    acc_password varchar(100) COLLATE pg_catalog."default",
    acc_email varchar(100) COLLATE pg_catalog."default",
    acc_phone_number varchar(15) COLLATE pg_catalog."default",
    acc_full_name varchar(100) COLLATE pg_catalog."default",
    acc_role varchar(5) COLLATE pg_catalog."default",
    acc_token varchar(100) COLLATE pg_catalog."default",
    acc_avatar text,
	acc_status integer DEFAULT 0,
    acc_created_date date,
    acc_updated_date date,
    CONSTRAINT tbl_account_pkey PRIMARY KEY (acc_id),
    CONSTRAINT tbl_account_roles_fkey FOREIGN KEY (acc_role)
        REFERENCES public.tbl_roles (rol_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_account
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.tbl_bill
(
    bill_id integer NOT NULL,
    bill_account_id integer,
    bill_total_price varchar(100) COLLATE pg_catalog."default",
    bill_total_quantity integer,
	bill_status integer DEFAULT 0,
    bill_created_date date,
    bill_updated_date date,
    CONSTRAINT tbl_bill_pkey PRIMARY KEY (bill_id)
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_bill
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_bill_detail
(
    bdetail_id integer NOT NULL,
    bdetail_bill_id integer,
    bdetail_product_id integer,
    bdetail_quantity integer,
    bdetail_product_price varchar(100) COLLATE pg_catalog."default",
	bdetail_status integer DEFAULT 0,
    bdetail_created_date date,
    bdetail_updated_date date,
    CONSTRAINT tbl_bill_detail_pkey PRIMARY KEY (bdetail_id),
    CONSTRAINT tbl_bill_detail_product_fkey FOREIGN KEY (bdetail_product_id)
        REFERENCES public.tbl_product (prod_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT tbl_bill_detal_bill_id_fkey FOREIGN KEY (bdetail_bill_id)
        REFERENCES public.tbl_bill (bill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_bill_detail
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_ware_house
(
    sto_id integer NOT NULL,
    sto_account_id integer,
    sto_product_name varchar(100) COLLATE pg_catalog."default",
    sto_amount integer,
    sto_category_id varchar(5) COLLATE pg_catalog."default",
    sto_origin_price varchar(100) COLLATE pg_catalog."default",
    sto_created_date date,
    sto_updated_date date,
    sto_product_id integer,
    cost varchar(100) COLLATE pg_catalog."default",
    CONSTRAINT tbl_ware_house_pkey PRIMARY KEY (sto_id),
    CONSTRAINT tbl_ware_house_account_fkey FOREIGN KEY (sto_account_id)
        REFERENCES public.tbl_account (acc_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT tbl_ware_house_categories_fkey FOREIGN KEY (sto_category_id)
        REFERENCES public.tbl_categories (cate_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT tbl_ware_house_product_fkey FOREIGN KEY (sto_product_id)
        REFERENCES public.tbl_product (prod_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_ware_house
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_cities
(
	ci_id varchar(5) COLLATE pg_catalog."default",
	ci_name varchar(50) COLLATE pg_catalog."default",
	CONSTRAINT tbl_cities_pkey PRIMARY KEY (ci_id)
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_cities
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_districts
(
	dis_id varchar(5) COLLATE pg_catalog."default",
	dis_name varchar(50) COLLATE pg_catalog."default",
	dis_city_id varchar(5) COLLATE pg_catalog."default",
	dis_ship_price varchar(100) COLLATE pg_catalog."default",
	dis_status integer DEFAULT 0,
	CONSTRAINT tbl_districts_pkey PRIMARY KEY (dis_id),
    CONSTRAINT tbl_districts_cities_fkey FOREIGN KEY (dis_city_id)
        REFERENCES public.tbl_cities (ci_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.tbl_districts
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_delivery_address
(
	del_id integer,
	del_detail_address varchar(150) COLLATE pg_catalog."default",
	del_district varchar(50) COLLATE pg_catalog."default",
	del_city varchar(50) COLLATE pg_catalog."default",
	del_user_id integer,
	del_status integer DEFAULT 0,
	CONSTRAINT tbl_delivery_address_pkey PRIMARY KEY (del_id),
	CONSTRAINT tbl_del_acc_fkey FOREIGN KEY (del_user_id)
		REFERENCES public.tbl_account (acc_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
)
TABLESPACE pg_default;

ALTER TABLE public.tbl_delivery_address
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_product_images
(
	prod_img_id integer,
	prod_img_product_id integer,
	prod_img_data text,
	prod_img_status integer DEFAULT 0,
	CONSTRAINT tbl_product_images_pkey PRIMARY KEY (prod_img_id, prod_img_product_id),
	CONSTRAINT tbl_prod_img_prod_fkey FOREIGN KEY (prod_img_product_id)
		REFERENCES public.tbl_product (prod_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
)
TABLESPACE pg_default;

ALTER TABLE public.tbl_delivery_address
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_comment
(
	cmt_id integer,
	cmt_content text,
	cmt_product_id integer,
	cmt_vote integer,
	cmt_status integer DEFAULT 0,
	CONSTRAINT tbl_comment_pkey PRIMARY KEY (cmt_id, cmt_product_id),
	CONSTRAINT tbl_cmt_prod_fkey FOREIGN KEY (cmt_product_id)
		REFERENCES public.tbl_product (prod_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
)
TABLESPACE pg_default;

ALTER TABLE public.tbl_delivery_address
    OWNER to postgres;
