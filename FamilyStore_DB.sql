--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tbl_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_account_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tbl_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_account (
    acc_id integer DEFAULT nextval('public.tbl_account_id_seq'::regclass) NOT NULL,
    acc_username character varying(100),
    acc_password character varying(100),
    acc_token character varying(100),
    acc_email character varying(100),
    acc_phone_number character varying(15),
    acc_full_name character varying(100),
    acc_role character varying(5),
    acc_avatar text,
    acc_status integer DEFAULT 2,
    acc_created_date date,
    acc_updated_date date
);


ALTER TABLE public.tbl_account OWNER TO postgres;

--
-- Name: tbl_bill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_bill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_bill_id_seq OWNER TO postgres;

--
-- Name: tbl_bill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_bill (
    bill_id integer DEFAULT nextval('public.tbl_bill_id_seq'::regclass) NOT NULL,
    bill_account_id integer,
    bill_total_price character varying(100),
    bill_total_quantity integer,
    bill_status integer DEFAULT 0,
    bill_created_date date,
    bill_updated_date date
);


ALTER TABLE public.tbl_bill OWNER TO postgres;

--
-- Name: tbl_bill_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_bill_detail (
    bdetail_id integer NOT NULL,
    bdetail_bill_id integer,
    bdetail_product_id integer,
    bdetail_quantity integer,
    bdetail_product_price character varying(100),
    bdetail_status integer DEFAULT 0,
    bdetail_created_date date,
    bdetail_updated_date date
);


ALTER TABLE public.tbl_bill_detail OWNER TO postgres;

--
-- Name: tbl_bill_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_bill_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_bill_detail_id_seq OWNER TO postgres;

--
-- Name: tbl_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_categories (
    cate_id character varying(5) NOT NULL,
    cate_name character varying(100),
    cate_status integer DEFAULT 0,
    cate_father character varying(5),
    cate_created_date date,
    cate_updated_date date
);


ALTER TABLE public.tbl_categories OWNER TO postgres;

--
-- Name: tbl_cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_cities (
    ci_id character varying(5) NOT NULL,
    ci_name character varying(50)
);


ALTER TABLE public.tbl_cities OWNER TO postgres;

--
-- Name: tbl_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_comment_id_seq OWNER TO postgres;

--
-- Name: tbl_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_comment (
    cmt_id integer DEFAULT nextval('public.tbl_comment_id_seq'::regclass) NOT NULL,
    cmt_content text,
    cmt_product_id integer NOT NULL,
    cmt_vote integer,
    cmt_status integer DEFAULT 0
);


ALTER TABLE public.tbl_comment OWNER TO postgres;

--
-- Name: tbl_delivery_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_delivery_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_delivery_address_id_seq OWNER TO postgres;

--
-- Name: tbl_delivery_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_delivery_address (
    del_id integer DEFAULT nextval('public.tbl_delivery_address_id_seq'::regclass) NOT NULL,
    del_detail_address character varying(150),
    del_district character varying(50),
    del_city character varying(50),
    del_user_id integer,
    del_status integer DEFAULT 0
);


ALTER TABLE public.tbl_delivery_address OWNER TO postgres;

--
-- Name: tbl_districts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_districts (
    dis_id character varying(5) NOT NULL,
    dis_name character varying(50),
    dis_city_id character varying(5),
    dis_ship_price character varying(100),
    dis_status integer DEFAULT 0
);


ALTER TABLE public.tbl_districts OWNER TO postgres;

--
-- Name: tbl_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_id_seq OWNER TO postgres;

--
-- Name: tbl_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_product (
    prod_id integer DEFAULT nextval('public.tbl_product_id_seq'::regclass) NOT NULL,
    prod_name character varying(60),
    prod_category_id character varying(5),
    prod_amount integer,
    prod_created_date date,
    prod_updated_date date,
    prod_price character varying(100),
    prod_status integer DEFAULT 0
);


ALTER TABLE public.tbl_product OWNER TO postgres;

--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_product_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_image_id_seq OWNER TO postgres;

--
-- Name: tbl_product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_product_images (
    prod_img_id integer DEFAULT nextval('public.tbl_product_image_id_seq'::regclass) NOT NULL,
    prod_img_product_id integer NOT NULL,
    prod_img_data text,
    prod_img_status integer DEFAULT 0
);


ALTER TABLE public.tbl_product_images OWNER TO postgres;

--
-- Name: tbl_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_roles (
    rol_id character varying(5) NOT NULL,
    rol_name character varying(5),
    role_status integer DEFAULT 0,
    rol_create_date date,
    rol_update_date date
);


ALTER TABLE public.tbl_roles OWNER TO postgres;

--
-- Name: tbl_ware_house_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_ware_house_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_ware_house_id_seq OWNER TO postgres;

--
-- Name: tbl_ware_house; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_ware_house (
    sto_id integer DEFAULT nextval('public.tbl_ware_house_id_seq'::regclass) NOT NULL,
    sto_account_id integer,
    sto_product_name character varying(100),
    sto_amount integer,
    sto_category_id character varying(5),
    sto_origin_price character varying(100),
    sto_created_date date,
    sto_updated_date date,
    sto_product_id integer,
    cost character varying(100)
);


ALTER TABLE public.tbl_ware_house OWNER TO postgres;

--
-- Data for Name: tbl_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_account (acc_id, acc_username, acc_password, acc_token, acc_email, acc_phone_number, acc_full_name, acc_role, acc_avatar, acc_status, acc_created_date, acc_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_bill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_bill (bill_id, bill_account_id, bill_total_price, bill_total_quantity, bill_status, bill_created_date, bill_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_bill_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_bill_detail (bdetail_id, bdetail_bill_id, bdetail_product_id, bdetail_quantity, bdetail_product_price, bdetail_status, bdetail_created_date, bdetail_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_categories (cate_id, cate_name, cate_status, cate_father, cate_created_date, cate_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_cities (ci_id, ci_name) FROM stdin;
\.


--
-- Data for Name: tbl_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_comment (cmt_id, cmt_content, cmt_product_id, cmt_vote, cmt_status) FROM stdin;
\.


--
-- Data for Name: tbl_delivery_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_delivery_address (del_id, del_detail_address, del_district, del_city, del_user_id, del_status) FROM stdin;
\.


--
-- Data for Name: tbl_districts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_districts (dis_id, dis_name, dis_city_id, dis_ship_price, dis_status) FROM stdin;
\.


--
-- Data for Name: tbl_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_product (prod_id, prod_name, prod_category_id, prod_amount, prod_created_date, prod_updated_date, prod_price, prod_status) FROM stdin;
\.


--
-- Data for Name: tbl_product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_product_images (prod_img_id, prod_img_product_id, prod_img_data, prod_img_status) FROM stdin;
\.


--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_roles (rol_id, rol_name, role_status, rol_create_date, rol_update_date) FROM stdin;
ADM	admin	0	2021-07-25	2021-07-25
\.


--
-- Data for Name: tbl_ware_house; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_ware_house (sto_id, sto_account_id, sto_product_name, sto_amount, sto_category_id, sto_origin_price, sto_created_date, sto_updated_date, sto_product_id, cost) FROM stdin;
\.


--
-- Name: tbl_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_account_id_seq', 6, true);


--
-- Name: tbl_bill_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_bill_detail_id_seq', 1, false);


--
-- Name: tbl_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_bill_id_seq', 1, false);


--
-- Name: tbl_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_comment_id_seq', 1, false);


--
-- Name: tbl_delivery_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_delivery_address_id_seq', 1, false);


--
-- Name: tbl_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_id_seq', 1, false);


--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_image_id_seq', 1, false);


--
-- Name: tbl_ware_house_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_ware_house_id_seq', 1, false);


--
-- Name: tbl_account tbl_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_pkey PRIMARY KEY (acc_id);


--
-- Name: tbl_bill_detail tbl_bill_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_bill_detail
    ADD CONSTRAINT tbl_bill_detail_pkey PRIMARY KEY (bdetail_id);


--
-- Name: tbl_bill tbl_bill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_bill
    ADD CONSTRAINT tbl_bill_pkey PRIMARY KEY (bill_id);


--
-- Name: tbl_categories tbl_categiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categiries_pkey PRIMARY KEY (cate_id);


--
-- Name: tbl_cities tbl_cities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_cities
    ADD CONSTRAINT tbl_cities_pkey PRIMARY KEY (ci_id);


--
-- Name: tbl_comment tbl_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_comment_pkey PRIMARY KEY (cmt_id, cmt_product_id);


--
-- Name: tbl_delivery_address tbl_delivery_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_delivery_address_pkey PRIMARY KEY (del_id);


--
-- Name: tbl_districts tbl_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_districts
    ADD CONSTRAINT tbl_districts_pkey PRIMARY KEY (dis_id);


--
-- Name: tbl_product_images tbl_product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_product_images_pkey PRIMARY KEY (prod_img_id, prod_img_product_id);


--
-- Name: tbl_product tbl_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_pkey PRIMARY KEY (prod_id);


--
-- Name: tbl_roles tbl_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_roles
    ADD CONSTRAINT tbl_roles_pkey PRIMARY KEY (rol_id);


--
-- Name: tbl_ware_house tbl_ware_house_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_pkey PRIMARY KEY (sto_id);


--
-- Name: tbl_account tbl_account_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_roles_fkey FOREIGN KEY (acc_role) REFERENCES public.tbl_roles(rol_id);


--
-- Name: tbl_bill_detail tbl_bill_detail_product_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_bill_detail
    ADD CONSTRAINT tbl_bill_detail_product_fkey FOREIGN KEY (bdetail_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_bill_detail tbl_bill_detal_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_bill_detail
    ADD CONSTRAINT tbl_bill_detal_bill_id_fkey FOREIGN KEY (bdetail_bill_id) REFERENCES public.tbl_bill(bill_id);


--
-- Name: tbl_comment tbl_cmt_prod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_prod_fkey FOREIGN KEY (cmt_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_delivery_address tbl_del_acc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_del_acc_fkey FOREIGN KEY (del_user_id) REFERENCES public.tbl_account(acc_id);


--
-- Name: tbl_districts tbl_districts_cities_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_districts
    ADD CONSTRAINT tbl_districts_cities_fkey FOREIGN KEY (dis_city_id) REFERENCES public.tbl_cities(ci_id);


--
-- Name: tbl_product_images tbl_prod_img_prod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_prod_img_prod_fkey FOREIGN KEY (prod_img_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_product tbl_product_categories_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_categories_fkey FOREIGN KEY (prod_category_id) REFERENCES public.tbl_categories(cate_id);


--
-- Name: tbl_ware_house tbl_ware_house_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_account_fkey FOREIGN KEY (sto_account_id) REFERENCES public.tbl_account(acc_id);


--
-- Name: tbl_ware_house tbl_ware_house_categories_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_categories_fkey FOREIGN KEY (sto_category_id) REFERENCES public.tbl_categories(cate_id);


--
-- Name: tbl_ware_house tbl_ware_house_product_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_product_fkey FOREIGN KEY (sto_product_id) REFERENCES public.tbl_product(prod_id);


--
-- PostgreSQL database dump complete
--

