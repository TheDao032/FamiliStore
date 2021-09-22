--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Ubuntu 13.4-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.3

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
-- Name: proc_update_product_insert_bill_detail(json, integer, character varying, character varying, character varying, integer, timestamp without time zone, character varying, character varying, character varying, integer, text); Type: PROCEDURE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE PROCEDURE public.proc_update_product_insert_bill_detail(listproduct json, accid integer, accaddress character varying, totalprice character varying, priceship character varying, totalquantity integer, timecurrent timestamp without time zone, receivername character varying, receiverphone character varying, receivernote character varying, INOUT resultcode integer, INOUT message text)
    LANGUAGE plpgsql
    AS $$
DECLARE
	temp integer;
	BEGIN
		BEGIN
			insert into tbl_bill(
				bill_account_id,
				bill_total_price,
				bill_total_quantity,
				bill_address,
				bill_price_ship,
				bill_name_receiver,
				bill_phone_receiver,
				bill_note_receiver,
				bill_created_date
			)
			values(accId, totalPrice, totalQuantity, accAddress, priceShip, receiverName, receiverPhone, receiverNote,timeCurrent);
			select max(bill_id) as maxId into temp from tbl_bill where bill_account_id = accId;
			
			update tbl_product
			set prod_amount = prod_amount - pro.prodQuantity,
				prod_updated_date = timeCurrent
			from (
				select (l->>'prodId')::int as prodId, (l->>'prodQuantity'):: int as prodQuantity
				from json_array_elements(listProduct) as l
			) pro
			where tbl_product.prod_id = pro.prodId;

			insert into tbl_bill_detail(
				bdetail_bill_id, bdetail_product_id, bdetail_quantity, bdetail_product_price, bdetail_created_date
			)
			select temp, (l->>'prodId')::int as prodId, (l->>'prodQuantity'):: int as prodQuantity, tblPro.prod_price, timeCurrent
			from json_array_elements(listProduct) as l, tbl_product as tblPro
			where (l->>'prodId')::int = tblPro.prod_id;
			
			exception when others then
				resultCode = temp;
				GET STACKED DIAGNOSTICS
					message = MESSAGE_TEXT;
				ROLLBACK;
				return;
		END;
		commit;
		resultCode = 0;
		message = 'success';
	END;
$$;


ALTER PROCEDURE public.proc_update_product_insert_bill_detail(listproduct json, accid integer, accaddress character varying, totalprice character varying, priceship character varying, totalquantity integer, timecurrent timestamp without time zone, receivername character varying, receiverphone character varying, receivernote character varying, INOUT resultcode integer, INOUT message text) OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_account_id_seq OWNER TO ugzmwzwyynriwv;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tbl_account; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_account (
    acc_id integer DEFAULT nextval('public.tbl_account_id_seq'::regclass) NOT NULL,
    acc_password character varying(100),
    acc_token character varying(100),
    acc_email character varying(100),
    acc_phone_number character varying(15),
    acc_full_name character varying(100),
    acc_role character varying(5),
    acc_avatar text,
    acc_status integer DEFAULT 2,
    acc_created_date date,
    acc_updated_date date,
    acc_token_forgot character varying(100),
    acc_refresh_token character varying(100)
);


ALTER TABLE public.tbl_account OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_bill_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_bill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_bill_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_bill; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_bill (
    bill_id integer DEFAULT nextval('public.tbl_bill_id_seq'::regclass) NOT NULL,
    bill_account_id integer,
    bill_total_price character varying(100),
    bill_address character varying(150),
    bill_total_quantity integer,
    bill_status integer DEFAULT 0,
    bill_price_ship character varying(100),
    bill_created_date character varying(100),
    bill_updated_date character varying(100),
    bill_name_receiver character varying(100),
    bill_phone_receiver character varying(15),
    bill_note_receiver character varying(1500)
);


ALTER TABLE public.tbl_bill OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_bill_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_bill_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_bill_detail_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_bill_detail; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_bill_detail (
    bdetail_id integer DEFAULT nextval('public.tbl_bill_detail_id_seq'::regclass) NOT NULL,
    bdetail_bill_id integer,
    bdetail_product_id integer,
    bdetail_quantity integer,
    bdetail_product_price character varying(100),
    bdetail_status integer DEFAULT 0,
    bdetail_created_date date,
    bdetail_updated_date date
);


ALTER TABLE public.tbl_bill_detail OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_cart_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_cart; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_cart (
    cart_id integer DEFAULT nextval('public.tbl_cart_id_seq'::regclass) NOT NULL,
    cart_acc_id integer,
    cart_prod_id integer,
    cart_amount integer,
    cart_total_price character varying(100),
    cart_status integer DEFAULT 0,
    cart_created_date date,
    cart_updated_date date
);


ALTER TABLE public.tbl_cart OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_categories_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_categories; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_categories (
    cate_id integer DEFAULT nextval('public.tbl_categories_id_seq'::regclass) NOT NULL,
    cate_name character varying(100),
    cate_status integer DEFAULT 0,
    cate_father integer,
    cate_created_date date,
    cate_updated_date date
);


ALTER TABLE public.tbl_categories OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_cities_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_cities_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_cities; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_cities (
    ci_id integer DEFAULT nextval('public.tbl_cities_id_seq'::regclass) NOT NULL,
    ci_name character varying(50),
    ci_created_date date,
    ci_updated_date date
);


ALTER TABLE public.tbl_cities OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_comment_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_comment; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_comment (
    cmt_id integer DEFAULT nextval('public.tbl_comment_id_seq'::regclass) NOT NULL,
    cmt_content text,
    cmt_product_id integer NOT NULL,
    cmt_vote integer,
    cmt_status integer DEFAULT 0,
    cmt_create_date character varying(100),
    cmt_update_date character varying(100),
    cmt_acc_id integer NOT NULL,
    cmt_bill_id integer
);


ALTER TABLE public.tbl_comment OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_delivery_address_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_delivery_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_delivery_address_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_delivery_address; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_delivery_address (
    del_id integer DEFAULT nextval('public.tbl_delivery_address_id_seq'::regclass) NOT NULL,
    del_detail_address character varying(150),
    del_district_id integer,
    del_city_id integer,
    del_user_id integer,
    del_status integer DEFAULT 0,
    del_ward_id integer
);


ALTER TABLE public.tbl_delivery_address OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_districts_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_districts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_districts_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_districts; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_districts (
    dis_id integer DEFAULT nextval('public.tbl_districts_id_seq'::regclass) NOT NULL,
    dis_name character varying(50),
    dis_city_id integer NOT NULL,
    dis_created_date date,
    dis_updated_date date
);


ALTER TABLE public.tbl_districts OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_product_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_product; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_product (
    prod_id integer DEFAULT nextval('public.tbl_product_id_seq'::regclass) NOT NULL,
    prod_name character varying(60),
    prod_category_id integer,
    prod_amount integer,
    prod_created_date date,
    prod_updated_date date,
    prod_price character varying(100),
    prod_description character varying(1000),
    prod_status integer DEFAULT 0,
    ts tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english'::regconfig, (COALESCE(prod_name, ''::character varying))::text), 'A'::"char")) STORED
);


ALTER TABLE public.tbl_product OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_product_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_image_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_product_images; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_product_images (
    prod_img_id integer DEFAULT nextval('public.tbl_product_image_id_seq'::regclass) NOT NULL,
    prod_img_product_id integer NOT NULL,
    prod_img_data text,
    prod_img_status integer DEFAULT 0
);


ALTER TABLE public.tbl_product_images OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_roles; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_roles (
    rol_id character varying(5) NOT NULL,
    rol_name character varying(5),
    role_status integer DEFAULT 0,
    rol_create_date date,
    rol_update_date date
);


ALTER TABLE public.tbl_roles OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_wards_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_wards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_wards_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_wards; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_wards (
    ward_id integer DEFAULT nextval('public.tbl_wards_id_seq'::regclass) NOT NULL,
    ward_name character varying(100),
    ward_city_id integer NOT NULL,
    ward_dis_id integer NOT NULL,
    ward_created_date date,
    ward_updated_date date,
    ward_ship_price character varying(100)
);


ALTER TABLE public.tbl_wards OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_ware_house_id_seq; Type: SEQUENCE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE SEQUENCE public.tbl_ware_house_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_ware_house_id_seq OWNER TO ugzmwzwyynriwv;

--
-- Name: tbl_ware_house; Type: TABLE; Schema: public; Owner: ugzmwzwyynriwv
--

CREATE TABLE public.tbl_ware_house (
    sto_id integer DEFAULT nextval('public.tbl_ware_house_id_seq'::regclass) NOT NULL,
    sto_account_id integer,
    sto_product_name character varying(100),
    sto_amount integer,
    sto_category_id integer,
    sto_origin_price character varying(100),
    sto_created_date date,
    sto_updated_date date,
    sto_product_id integer,
    sto_cost character varying(100),
    sto_status integer DEFAULT 0
);


ALTER TABLE public.tbl_ware_house OWNER TO ugzmwzwyynriwv;

--
-- Data for Name: tbl_account; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_account (acc_id, acc_password, acc_token, acc_email, acc_phone_number, acc_full_name, acc_role, acc_avatar, acc_status, acc_created_date, acc_updated_date, acc_token_forgot, acc_refresh_token) FROM stdin;
57	$2b$04$hZuYeAvU4QDVcphsDx46qeereBha.WYBKzbr5xDKaA9Xz3SR.Ahaq	$2b$04$EQwBXHWEZ1y5iTZe3BRpHudhO39YTbjcIhw8KsLGT/Kn6kNMDFRa2	lty71356@cuoly.com	841111111111	lty71356@cuoly.com	USER	\N	2	2021-09-16	\N	\N	\N
58	$2b$04$96zXnalsujcVXCebqu.lz.bmxJmiKsjKDO0Virz4c0nqnwBYg14Ly	$2b$04$TGwClSVEoP8CgU1/VI1VL.L.PXPtFyCxkDaNsuvJP0/THoMWSChW6	mlt67886@boofx.com	84111111111	mlt67886@boofx.com	USER	\N	2	2021-09-16	\N	\N	\N
3	$2a$04$oEnoFPHAEv9Nd0DXCK7mdeXCfdaPRWB7xVxLc5VTyWllc4QgsNq4W	\N	user19@admin.com	08591111111	Người dơi 123	ADM	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1631950982/t540pprv6qitaqxyxfof.jpg	0	2021-09-11	2021-09-21	\N	RLESlAO9Qcp9pPhxdmqAyORybVjufCcFtbtTjm98SLnPJZB4jb1MYV3BvPX1Ar7EYGioROmP17mULLX3gKXtqirbOjSkatmkaI84
4	$2a$04$oEnoFPHAEv9Nd0DXCK7mdeXCfdaPRWB7xVxLc5VTyWllc4QgsNq4W	\N	user34@admin.com	222222222	user	USER	\N	0	2021-09-11	2021-09-20	\N	NZOnsfdYuiyDJaKLNcLjqnvFO53N1JOR3mMxV490y4NRrplbR1OZKSRD2kDmB85Q9puORzn6i6UAQipmlQdTrn09W1IJeIxAzLY4
55	$2b$04$vJJO/po3zriFCyAmQtammO9a50/qKqpA3nFVmT2ERu/9sxCRGHiWu	\N	user123@user.com	84111111111	user 1	USER	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1631689938/qq8veovxevjefz2pc22x.jpg	0	2021-09-13	2021-09-14	\N	IeY8klqs3EwIUOZqr30F07Ni75bLFw2mSMf6vfdKvcvczz07lE3HbNXL5IipLAEs7V9puTuD7F3HlGHgjoTVxBKwRjNBI1pPvYcG
59	$2b$04$p0eDkgCkRcZjT03CVLzGiumOZZa.oABh9Axw8fXjxNkqIkrjYD/fC	$2b$04$7YWuzLOTEJ.Td8i0CRWyre2luJj9/YsbUFMnrCwt2lG1mypZ5Aqa2	nt11061999@gmail.com	account 1	account 1	ADM	\N	2	2021-09-18	\N	\N	\N
62	$2b$04$Mzeb871rNYUE.opgzw5.nedRlTCpzOr9LK6B4EyxHnYo9b.j6yR/K	$2b$04$Wfqs9eynHUlxluj.cL9v..0X7Bu638S88tkS7zamCZGOgRgnwjmGq	hadikoy879@secbuf.com	84123456121	name	USER	\N	2	2021-09-19	2021-09-20	$2b$04$c2yEYnUkOAfKQ68iR0ZVt.L2YlEksfDN5dVHDEmmJhZidNcHdHETu	uY2O2RBzSReVXsLNwEroYV7VrlgVLoqFhjwnqGQJzQApfrroajxgw5SB0oK2iOoWGzdsZpWuEs4YQMPSNJmWkd8wSxC6sedqsVWx
56	$2b$04$VvrN.ltxbhYIovPrsfwX9.B4pI1GVZ2QmnK3muNW0X6.mycFERX2a	$2b$04$9Vx4YBoYLDrGEFKfKYYd4eRWwXffr5iLEoxyZ7ljPJ5Top1/QPI4y	hello12321@gmail.com	8408598105610	12345@gmail.com	ADM	\N	1	2021-09-13	\N	\N	\N
60	$2b$04$tJc3cCM9hee0nzgTQdFpGuclE5XfOpNpvJ1fcmf5Bg4B/DQQK2r/m	$2b$04$DJxvIWmd9YLbmZAzLyYZpuvGggAmZfcjoW4PMzPPKy71/Rv76mnAG	nguyenminhtam1106999@gmail.com	account 1	account 1	ADM	\N	2	2021-09-18	\N	\N	\N
53	$2b$04$3qDc3KJm7MOx30gzQ9blfebqGkvpJFIjEr6lX.RXLPycgZc3UErbW	\N	kipoca1578@stvbz.com	84123123123	hieu kast	USER	\N	1	2021-09-12	2021-09-12	\N	pUUGcMTHYdqrJvZYy8zgYTsyjUtV5xUOuqnlFkti1hDnbKfJ5bBWtskDJrvB95rmRMSzmeV44vbV2rq9T6LSMvlrHgokQHNIj3Gb
52	$2b$04$8HU8FCGCqifFTBzxgsLfNOfcVuEI0AEzSVB8g7T8VVBCts21xn71y	$2b$04$btnnHVYCP8ChjEDdauQLhe5NFFT1jQQsarViT5BS3LYlkINrWP39i	dangtrunghieu2304@gmai.com	84151231511	Hieu Dang PC123	USER	\N	2	2021-09-12	2021-09-13	\N	\N
2	$2b$04$zAbcNxR4KCzyN/DN6i87CusCiZmG2CwCoguWlzQ62G2zZvrWjgqey	\N	admin2@admin.com	84123456121	admin tối cao 2	USER	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1631607099/c8r98v6orjabtob3jlpa.jpg	0	2021-09-11	2021-09-19	\N	NMlqGgY8bWuxhnTMAzLt6P8Xaheg58JICQI9dAnpQ4nbllDhCHdJH9B9JC3UtlJSllqZqHQz68n3HT74hEb3Drg5HefTz6WgLikN
1	$2a$04$oEnoFPHAEv9Nd0DXCK7mdeXCfdaPRWB7xVxLc5VTyWllc4QgsNq4W	\N	admin1@admin.com	\N	admin tối cao 1	ADM	\N	0	2021-09-11	2021-09-11	\N	nr9W2VilKaDBt0rynxbVdrgwwYMkfSdkrTt7nvaEUaaZdPOeF3AtchCah66CHqEvgM5x6m7KujXINxE8cNUx6GJLCbYQTSN1nhKV
67	$2b$04$lZS61mVbAULyPj0N9AsrNeAK46tQzPeh8dPQOuJXmBkbTWGu6UqHO	$2b$04$zEZLXZaIRz1jD.CgPnyFHuGLeLMWB7N/DQu6lUFf4MqeRSlpRq86m	email@emai.com	84111111111	1	USER	\N	1	2021-09-21	\N	\N	\N
64	$2b$04$luVIbs0htlheR.6wSzZUkec1KpCXW7gRvDz61qapyUGn3pCxV5iQO	\N	baciho1178@tinilalo.com	84123456121	Tuấn Anh	USER	\N	0	2021-09-20	2021-09-20	\N	Mh2UehoAi2aRWpe2KOuInAE5X7Wpl0FQQq5FY7fNZRc3FtXhuh54L3oD9YuAGzyOJIk4opHGlTkzTwQXcAhw9EdAvTz4BkNouZTb
65	$2b$04$2RwSpE2rcttxlthpNM3wNe8HDIGyV.jzx9gkeX9xdYVvdjK.BYFlG	\N	vghuy17ck1@gmail.com	84784635273	User	USER	\N	0	2021-09-21	2021-09-21	\N	BNK2kc84WeyQBUJIXQtZMqgq3DU5E3t51IcMo1LN2M2lcXugBlQFm62UDEpmCG2B7fUyIlULeUpGyWgo1o93a9aS4BJe7c6sRx7S
54	$2b$04$49PJ/7GxEIYJDUpig.uqge3xQmijdeViwCIk/AtM/7GplFkIH2dYq	\N	user2@user.com	84123456789	user	USER	\N	0	2021-09-13	\N	\N	VKDtXUAzEJJyj7aTH7OEG12YE1Q41VNfcDSeJN0OFfStfkghcjtcWZ7o7GsBWqULuPN5eKwGkESXwS1pHF1spy5CX2agv92RoVya
66	$2b$04$CEpOmZdZDKgIZhYu3TtF.O4DdOHpPfo1TKb9f1Sfcui7En5tn9Iz6	$2b$04$H5Uv3gJdvLENY9/By.vqs.sTosaBO7txU2eodTRqAprvUDafjGbBS	email12345@emai.com	8411111111	0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789	USER	\N	1	2021-09-21	2021-09-22	\N	\N
\.


--
-- Data for Name: tbl_bill; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_bill (bill_id, bill_account_id, bill_total_price, bill_address, bill_total_quantity, bill_status, bill_price_ship, bill_created_date, bill_updated_date, bill_name_receiver, bill_phone_receiver, bill_note_receiver) FROM stdin;
68	64	3050000	Trần,phường Nguyễn Thái Bình,Quận 1,TPHCM	1	1	3000000	2021-09-20 09:29:14	\N	Nguyễn Đoàn Tuấn Anh	0974081661	TuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananh
69	64	3074000	Trần,phường Bến Thành,Quận 1,TPHCM	1	1	3000000	2021-09-20 09:43:09	\N	Nguyễn Đoàn Tuấn Anh	0974081661	
70	2	6080000	test,phường An Khánh,Quận 2,TPHCM	1	1	6000000	2021-09-20 09:45:23	\N	test	0393027852	test
71	64	3084000	Trần Hưng đạo,phường Bến Nghé,Quận 1,TPHCM	1	1	3000000	2021-09-20 15:10:32	\N	Nguyễn Đoàn Tuấn Anh	0974081661	
50	55	3010000	192 xyz,phường Cô Giang,Quận 1,TPHCM	1	1	3000000	2021-09-14 11:15:35	\N	NTN vlog	0123456789	thông chốt giùm
51	54	3045000	127 bui thi xuan,phường Đa Kao,Quận 1,TPHCM	1	1	3000000	2021-09-17 06:23:04	\N	Trung Hieu	0123456789	thông chốt nha
52	54	3200000	127 bui thi xuan,phường Đa Kao,Quận 1,TPHCM	1	1	3000000	2021-09-17 06:28:43	\N	hieu	0123456789	hi
53	4	3074000	1,phường Bến Nghé,Quận 1,TPHCM	1	1	3000000	2021-09-17 08:33:55	\N	1	1111111111	
54	4	3074000	1,phường Bến Nghé,Quận 1,TPHCM	1	1	3000000	2021-09-17 08:44:14	\N	1	111111111111	
55	54	3200000	127 bui thi xuan,phường Đa Kao,Quận 1,TPHCM	1	1	3000000	2021-09-18 02:52:27	\N	hieu pc	0123456789	yo
56	55	3074000	asdasd,phường Phạm Ngũ Lão,Quận 1,TPHCM	1	1	3000000	2021-09-18 06:22:32	\N	asdas	0123123123	
57	3	3074000	132,phường Bến Nghé,Quận 1,TPHCM	1	1	3000000	2021-09-18 06:28:34	\N	13	0132465789	
58	54	3166000	127 bui thi xuan,phường Đa Kao,Quận 1,TPHCM	2	1	3000000	2021-09-18 10:23:30	\N	hieu pc	0113114115	alo
60	54	1045000	192 lưu hữu phước,phường Bình Đông,Quận 8,TPHCM	1	1	1000000	2021-09-18 11:38:15	2021-09-21 06:36:00	Hiếu PC hacker	0114115115	aaa
72	4	2186000	127 Nguyễn Huệ,phường 12,Quận 6,TPHCM	3	1	2000000	2021-09-21 10:17:49	\N	Trần Trung Tính	0168274824	Giao trước 15h
73	4	3186000	1,phường Bến Nghé,Quận 1,TPHCM	3	1	3000000	2021-09-21 10:38:22	\N	Nguyen van huy	970095480000	
74	54	1109000	192 lưu hữu phước,phường Bình Đông,Quận 8,TPHCM	1	1	1000000	2021-09-21 10:48:35	\N	hieu pc	0123456789	sdasds
75	4	3178000	172 Nguyễn Hữu Đa,phường Bến Thành,Quận 1,TPHCM	2	1	3000000	2021-09-21 10:51:36	\N	defaultCartState	0123456789	
63	2	3100000	Trần hưng đạo ,phường Bến Nghé,Quận 1,TPHCM	1	1	3000000	2021-09-20 06:49:35	\N	name	0974081661	
64	2	3100000	Trần hưng đạo ,phường Bến Nghé,Quận 1,TPHCM	1	1	3000000	2021-09-20 06:52:04	\N	name	0974081661	
65	64	600000	Đường A,phường Đông Bình,Quận 9,TPHCM	1	1	500000	2021-09-20 07:06:31	\N	Nguyễn Đoàn Tuấn Anh	0974081661	
66	64	3000000	Trần Hưng đạo,phường Bến Nghé,Quận 1,TPHCM	0	1	3000000	2021-09-20 09:13:02	\N	Nguyễn Đoàn Tuấn Anh	0974081661	
67	64	3109000	Trần,phường Nguyễn Thái Bình,Quận 1,TPHCM	1	1	3000000	2021-09-20 09:22:39	\N	Tuấn Anh	0974081661	TuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananhTuananh
76	4	3096000	1,phường Bến Nghé,Quận 1,TPHCM	1	1	3000000	2021-09-21 10:54:00	\N	nguyen van huy	1324567890	
77	2	1096000	Nhà riêng 11/111,phường 9,Quận 5,TPHCM	1	1	1000000	2021-09-21 19:06:10	\N	tam test	1232132121	testtestetst
78	65	3480000	283 Nguyễn Huệ,phường An Phú,Quận 2,TPHCM	5	1	3000000	2021-09-21 21:16:33	\N	Huy	0946736485	Giao trước 15 giờ
62	54	1080000	192 lưu hữu phước,phường Bình Đông,Quận 8,TPHCM	1	2	1000000	2021-09-18 17:27:34	2021-09-16 07:17:07	hieu pc	0111111109	a
61	54	1045000	192 lưu hữu phước,phường Bình Đông,Quận 8,TPHCM	1	2	1000000	2021-09-18 11:41:37	2021-09-19 09:01:00	hiếu pc vip	0123456789	ngon
49	3	3086184	132,phường Bến Nghé,Quận 1,TPHCM	7	2	3000000	2021-09-12 00:47:59	2021-09-19 09:06:34	a	1234567891	
59	54	1045000	192 lưu hữu phước,phường Bình Đông,Quận 8,TPHCM	1	2	1000000	2021-09-18 10:31:14	2021-09-19 09:09:10	Hiếu PC vip pro 01 VN	0114114115	alo
\.


--
-- Data for Name: tbl_bill_detail; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_bill_detail (bdetail_id, bdetail_bill_id, bdetail_product_id, bdetail_quantity, bdetail_product_price, bdetail_status, bdetail_created_date, bdetail_updated_date) FROM stdin;
55	50	121	1	10000	0	2021-09-14	\N
56	51	64	1	45000	0	2021-09-17	\N
57	52	122	1	200000	0	2021-09-17	\N
58	53	71	1	74000	0	2021-09-17	\N
59	54	71	1	74000	0	2021-09-17	\N
60	55	122	1	200000	0	2021-09-18	\N
61	56	71	1	74000	0	2021-09-18	\N
62	57	71	1	74000	0	2021-09-18	\N
63	58	67	1	84000	0	2021-09-18	\N
64	58	68	1	82000	0	2021-09-18	\N
68	62	69	1	80000	1	2021-09-18	2021-09-19
67	61	64	1	45000	2	2021-09-18	2021-09-19
54	49	62	7	12312	2	2021-09-12	2021-09-19
65	59	64	1	45000	2	2021-09-18	2021-09-19
69	63	128	1	100000	0	2021-09-20	\N
70	64	130	1	100000	0	2021-09-20	\N
71	65	129	1	100000	0	2021-09-20	\N
72	67	56	1	109000	0	2021-09-20	\N
73	68	74	1	50000	0	2021-09-20	\N
74	69	71	1	74000	0	2021-09-20	\N
75	70	70	1	80000	0	2021-09-20	\N
76	71	67	1	84000	0	2021-09-20	\N
66	60	64	1	45000	2	2021-09-18	2021-09-21
77	72	64	2	45000	0	2021-09-21	\N
78	72	65	1	96000	0	2021-09-21	\N
79	73	65	1	96000	0	2021-09-21	\N
80	73	64	2	45000	0	2021-09-21	\N
81	74	56	1	109000	0	2021-09-21	\N
82	75	65	1	96000	0	2021-09-21	\N
83	75	68	1	82000	0	2021-09-21	\N
84	76	65	1	96000	0	2021-09-21	\N
85	77	65	1	96000	0	2021-09-21	\N
86	78	65	5	96000	0	2021-09-21	\N
\.


--
-- Data for Name: tbl_cart; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_cart (cart_id, cart_acc_id, cart_prod_id, cart_amount, cart_total_price, cart_status, cart_created_date, cart_updated_date) FROM stdin;
80	3	71	4	\N	1	\N	2021-09-18
201	54	68	1	\N	1	\N	2021-09-22
202	54	64	1	\N	1	\N	2021-09-22
196	4	64	1	\N	1	\N	2021-09-21
\.


--
-- Data for Name: tbl_categories; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_categories (cate_id, cate_name, cate_status, cate_father, cate_created_date, cate_updated_date) FROM stdin;
127	Tả, Đồ Cho Bé	0	\N	2021-09-06	2021-09-06
211	Đồ dùng văn phòng	0	121	2021-09-06	2021-09-06
134	Khăn ướt, khăn sữa	0	127	2021-09-06	2021-09-06
135	Sữa uống cho bé	0	127	2021-09-06	2021-09-06
136	Nước giặt, nước xả	0	127	2021-09-06	2021-09-06
137	Chải răng cho bé	0	127	2021-09-06	2021-09-06
138	Dầu gội, sữa tắm	0	127	2021-09-06	2021-09-06
139	Tã bỉm cho bé	0	127	2021-09-06	2021-09-06
140	Khẩu trang, tăm bông	0	127	2021-09-06	2021-09-06
141	Phấn thơm, dưỡng ẩm	0	127	2021-09-06	2021-09-06
142	Bình sữa, nước rửa	0	127	2021-09-06	2021-09-06
146	Đường, muối, gia vị	0	128	2021-09-06	2021-09-06
147	Dầu ăn các loại	0	128	2021-09-06	2021-09-06
148	Hạt nêm, bột ngọt	0	128	2021-09-06	2021-09-06
149	Nước mắm các loại	0	128	2021-09-06	2021-09-06
150	Gia vị nêm sẵn	0	128	2021-09-06	2021-09-06
151	Tương ớt, tương đen	0	128	2021-09-06	2021-09-06
152	Nước tương các loại	0	128	2021-09-06	2021-09-06
153	Dầu hào, giấm, bơ	0	128	2021-09-06	2021-09-06
154	Nước chấm, mắm tôm	0	128	2021-09-06	2021-09-06
155	Nước ngọt, nước trà	0	108	2021-09-06	2021-09-06
156	Cafe, trà các loại	0	108	2021-09-06	2021-09-06
157	Nước uống tăng lực	0	108	2021-09-06	2021-09-06
158	Nước uống trái cây	0	108	2021-09-06	2021-09-06
159	Bia, nước có cồn	0	108	2021-09-06	2021-09-06
160	Nước suối, nước khoáng	0	108	2021-09-06	2021-09-06
161	Trà sữa đóng chai	0	108	2021-09-06	2021-09-06
162	Nước yến dinh dưỡng	0	108	2021-09-06	2021-09-06
163	Mật ong, bột nghệ	0	108	2021-09-06	2021-09-06
164	Rượu ngon các loại	0	108	2021-09-06	2021-09-06
165	Sữa tươi các loại	0	109	2021-09-06	2021-09-06
166	Sữa hạt, sữa đậu	0	109	2021-09-06	2021-09-06
167	Sữa đặc các loại	0	109	2021-09-06	2021-09-06
108	Đồ Uống Các Loại	0	\N	2021-09-05	2021-09-05
109	Sữa Uống Các Loại	0	\N	2021-09-05	2021-09-05
110	Bánh Kẹo Các Loại	0	\N	2021-09-05	2021-09-05
111	Mì, Cháo, Phở, Bún	0	\N	2021-09-05	2021-09-05
168	Sữa chua, phô mai	0	109	2021-09-06	2021-09-06
113	Thịt, cá, tôm, trứng	0	107	2021-09-05	2021-09-05
115	Thực phẩm sơ chế	0	107	2021-09-05	2021-09-05
116	Thực phẩm đông lạnh	0	107	2021-09-05	2021-09-05
169	Thức uống lúa mạch	0	109	2021-09-06	2021-09-06
170	Ngũ cốc, ca cao	0	109	2021-09-06	2021-09-06
171	Sữa bột các loại	0	109	2021-09-06	2021-09-06
172	Bánh snack, rong biển	0	110	2021-09-06	2021-09-06
122	Vệ Sinh Nhà Cửa	0	\N	2021-09-06	2021-09-06
123	Chăm Sóc Thú Cưng	0	\N	2021-09-06	2021-09-06
121	Đồ Dùng Gia Đình	0	\N	2021-09-06	2021-09-06
174	Singum, kẹo các loại	0	110	2021-09-06	2021-09-06
175	Bánh gạo, bánh xốp	0	110	2021-09-06	2021-09-06
176	Bánh bông lan ngọt	0	110	2021-09-06	2021-09-06
177	Bánh socola, kẹo socola	0	110	2021-09-06	2021-09-06
178	Bánh que, bánh quế	0	110	2021-09-06	2021-09-06
179	Mứt, thạch các loại	0	110	2021-09-06	2021-09-06
180	Ăn vặt văn phòng	0	110	2021-09-06	2021-09-06
181	Hạt, trái cây sấy	0	110	2021-09-06	2021-09-06
182	Mì gói ăn liền	0	111	2021-09-06	2021-09-06
183	Phở, hủ tiếu, miến	0	111	2021-09-06	2021-09-06
184	Cháo gói, cháo tươi	0	111	2021-09-06	2021-09-06
185	Bánh canh, bánh đa	0	111	2021-09-06	2021-09-06
186	Bánh gạo Hàn Quốc	0	111	2021-09-06	2021-09-06
187	Nước giặt, bột giặt	0	122	2021-09-06	2021-09-06
188	Nước rửa chén dĩa	0	122	2021-09-06	2021-09-06
189	Lau sàn, lau bếp	0	122	2021-09-06	2021-09-06
190	Tẩy rửa nhà tắm	0	122	2021-09-06	2021-09-06
191	Bình diệt côn trùng	0	122	2021-09-06	2021-09-06
192	Xịt phòng, sáp thơm	0	122	2021-09-06	2021-09-06
193	Nước tẩy quần áo	0	122	2021-09-06	2021-09-06
194	Túi, bao đựng rác	0	122	2021-09-06	2021-09-06
195	Thức ăn chó mèo	0	123	2021-09-06	2021-09-06
200	Đồ dùng nhà bếp	0	121	2021-09-06	2021-09-06
201	Các đồ dùng khác	0	121	2021-09-06	2021-09-06
202	Tô, chén, dĩa, ly	0	121	2021-09-06	2021-09-06
203	Pin tiểu các loại	0	121	2021-09-06	2021-09-06
204	Đồ dùng một lần	0	121	2021-09-06	2021-09-06
205	Dao, kéo, thớt gỗ	0	121	2021-09-06	2021-09-06
206	Đũa, muỗng, nĩa, vá	0	121	2021-09-06	2021-09-06
207	Nồi, niêu, xoong, chảo	0	121	2021-09-06	2021-09-06
208	Màng bọc thực phẩm	0	121	2021-09-06	2021-09-06
209	Bình nước, giữ nhiệt	0	121	2021-09-06	2021-09-06
210	Hộp đựng thực phẩm	0	121	2021-09-06	2021-09-06
213	123	0	109	2021-09-11	2021-09-11
107	Thịt, Cá, Trứng, Rau	0	\N	2021-09-05	2021-09-21
128	Dầu Ăn, Gia Vị	0	\N	2021-09-06	2021-09-21
212	Rau xanh 4KFarm	0	107	2021-09-06	2021-09-21
114	Rau củ, rau nêm	0	107	2021-09-05	2021-09-21
\.


--
-- Data for Name: tbl_cities; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_cities (ci_id, ci_name, ci_created_date, ci_updated_date) FROM stdin;
1	TPHCM	2021-09-05	\N
\.


--
-- Data for Name: tbl_comment; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_comment (cmt_id, cmt_content, cmt_product_id, cmt_vote, cmt_status, cmt_create_date, cmt_update_date, cmt_acc_id, cmt_bill_id) FROM stdin;
17	Tam test	64	4	0	2021-09-18 15:44:02	2021-09-18 15:44:02	2	61
18	hello	69	5	0	2021-09-19 04:46:19	2021-09-19 04:46:19	55	62
19	asd	64	5	0	2021-09-19 09:09:01	2021-09-19 09:09:01	55	61
20	asdf	64	5	0	2021-09-19 09:09:18	2021-09-19 09:09:18	55	59
21	12321312	64	5	0	2021-09-19 09:14:23	2021-09-19 09:14:23	4	60
22	dc	64	5	0	2021-09-21 06:36:25	2021-09-21 06:36:25	54	60
23	546565	64	5	0	2021-09-21 06:39:33	2021-09-21 06:39:33	54	61
24	5465656	69	5	0	2021-09-21 06:39:41	2021-09-21 06:39:41	54	62
25	hàng tốt	65	3	0	2021-09-22 16:47:20	2021-09-22 16:47:20	2	77
26	Thịt tươi	70	5	0	2021-09-22 16:48:55	2021-09-22 16:48:55	2	70
\.


--
-- Data for Name: tbl_delivery_address; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_delivery_address (del_id, del_detail_address, del_district_id, del_city_id, del_user_id, del_status, del_ward_id) FROM stdin;
1	132	1	1	3	0	1
2	192 xyz	1	1	55	0	10
3	127 bui thi xuan	1	1	54	0	7
4	Nam hoa, HoaThuy, HoaThuy	1	1	3	0	1
5	Nam hoa	1	1	3	0	1
6	1	1	1	4	0	1
7	asdasd	1	1	55	0	4
8	192 lưu hữu phước	8	1	54	0	34
9	Trần hưng đạo 	1	1	2	0	1
10	Đường A	9	1	64	0	35
11	Trần Hưng đạo	1	1	64	0	1
12	Trần	1	1	64	0	5
13	test	2	1	2	0	13
14	172 Nguyễn Hữu Đa	1	1	4	0	2
15	Nhà riêng 11/111	5	1	2	0	27
16	283 Nguyễn Huệ	2	1	65	0	11
\.


--
-- Data for Name: tbl_districts; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_districts (dis_id, dis_name, dis_city_id, dis_created_date, dis_updated_date) FROM stdin;
1	Quận 1	1	\N	\N
2	Quận 2	1	\N	\N
3	Quận 3	1	\N	\N
4	Quận 4	1	\N	\N
5	Quận 5	1	\N	\N
6	Quận 6	1	\N	\N
7	Quận 7	1	\N	\N
8	Quận 8	1	\N	\N
9	Quận 9	1	\N	\N
10	Quận 10	1	\N	\N
11	Quận 11	1	\N	\N
12	Quận 12	1	\N	\N
13	Quận Bình Thạnh	1	\N	\N
14	Quận Thủ Đức	1	\N	\N
15	Quận Gò Vấp	1	\N	\N
16	Quận Phú Nhuận	1	\N	\N
17	Quận Tân Bình	1	\N	\N
18	Quận Tân Phú	1	\N	\N
19	Quận Bình Tân	1	\N	\N
20	Huyện Nhà Bè	1	\N	\N
21	Huyện Hóc Môn	1	\N	\N
22	Huyện Bình Chánh	1	\N	\N
23	Huyện Củ Chi	1	\N	\N
24	Huyện Cần Giờ	1	\N	\N
\.


--
-- Data for Name: tbl_product; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_product (prod_id, prod_name, prod_category_id, prod_amount, prod_created_date, prod_updated_date, prod_price, prod_description, prod_status) FROM stdin;
110	Cá hồi xốt Teriyaki Meiwa hộp 310g	115	10	2021-09-13	\N	120000	Với nguyên liệu cá hồi Nhật cùng nước xốt Teriyakki đặc trựng của xứ Phù Tang. Cá hồi xốt Teriyaki Meiwa 310g đến từ thương hiệu thực phẩm Meiwa mang đến hương vị đặc trưng của Nhật Bản được xem là loại thực phẩm làm sẵn tiện lợi và cung cấp nguồn năng lượng dồi dào.<img src="https://cdn.tgdd.vn/Products/Images/7259/244661/bhx/ca-hoi-xot-teriyaki-meiwa-hop-310g-202107151412365039.jpg" alt=""/>\n	0
80	Nấm bào ngư trắng túi 300g	114	10	2021-09-13	\N	20000	Nấm bào ngư là loại nấm có những đặc điểm dễ nhận biết: tai nấm có dạng phễu lệch, phiến nấm mang bào tử kéo dài xuống đến chân, cuống nấm gần gốc có lớp lông nhỏ mịn, nấm bào ngư trắng còn có những tên gọi khác là nấm sò, nấm hương trắng, nấm dai và tên khoa học là Pleurotus florida. Từ lâu nấm bào ngư trắng đã trở thành sản phẩm quen thuộc trong bữa ăn của mỗi gia đình Việt, nấm bào ngư trắng có thể dùng để chế biến thành các món chính hoặc dùng để nhúng lẩu hoặc ăn kèm như các loại rau khác.<img src="https://cdn.tgdd.vn/Products/Images//8820/226955/bhx/files/nam-bao-ngu-trang-bich-300g-202009300010105865.jpg" alt=""/>\n	0
81	Rau cải ngọt baby tươi xanh 300g	114	10	2021-09-13	\N	18800	Cải ngọt baby là một trong những loại rau cải được sử dụng phổ biến trong các bữa ăn của người Việt. Cải ngọt có thân tròn, phần lá có dạng tròn hoặc tù, màu xanh mướt. Cải ngọt có vị ngọt thanh rất phù hợp trong việc chế biến nhiều món ăn khác nhau. Ngoài ra cải ngọt còn mang đến nhiều lợi ích cho sức khỏe như phòng ngừa ung thư, hỗ trợ trị bệnh gout, trĩ, xơ gan, tăng sức đề kháng và thanh lọc cơ thể. <img src="https://cdn.tgdd.vn/Products/Images//8820/226914/bhx/files/Untitled-1.jpg" alt=""/>\n	0
87	Rau tần ô tươi xanh túi 300g	114	10	2021-09-13	\N	7500	Rau tần ô hay còn gọi là rau cải cúc, là một loại rau có tính hàn mát, vị ngọt nhẹ, rất phù hợp cho việc chế biến thành các món canh rau cho gia đình. Ngoài ra, rau tần ô cũng mang đến nhiều lợi ích cho sức khỏe con người như trị ho, trị đau đầu, lợi tiểu, chữa tiêu chảy,...<img src="https://cdn.tgdd.vn/Products/Images//8820/226899/bhx/images/rau-tan-o-tui-500g-202009300000177998.jpg" alt=""/>\n	0
89	Rau cải bẹ xanh tươi túi 300g	114	10	2021-09-13	\N	6000	Cải bẹ xanh của Bách hóa Xanh được nuôi trồng và đóng gói theo những tiêu chuẩn nghiêm ngặt, bảo đảm các tiêu chuẩn xanh - sach, chất lượng và an toàn với người dùng. Với bẹ lá to, vị hơi đắng nhẹ, mát và thơm nên thường được dùng để nấu canh hoặc rau cuốn ăn kèm với bánh xèo, gỏi cuốn. Cải bẹ xanh hay còn gọi là cải cay, cải canh,... có tên khoa học là Brassica juncea (L.). Tuy cùng họ cải và khá gần với nhau nhưng cải bẹ xanh có ngoại hình hoàn toàn khác với cải ngọt với phần lá có răng cưa ở viền, mặt lá nhám và trải dọc đến tận cuốn. Cũng như nhiều loại rau khác, cải bẹ xanh chứa hàm lượng calories rất thấp nhưng lại có nhiều chất dinh dưỡng cần thiết cho cơ thể như Vitamin A, B, C, K, Axit nicotic, Abumin, Catoten…<img src="https://cdn.tgdd.vn/Products/Images//8820/226912/bhx/files/cai-be-xanh-tui-500g-202009292341350261.jpg" alt=""/>\n	0
90	Cá viên chiên Tân Việt Sin 200g	116	10	2021-09-13	\N	32000	Cá viên Tân Việt Sin luôn mang đến những loại cá viên tươi ngon và giàu chất dinh dưỡng. Cá viên Tân Việt Sin gói 200g làm từ nguyên liệu chả cá tươi ngon kết hợp với các loai gia vị, có thể đa dạng sử dụng chế biến: nướng, chiên hoặc nấu lẩu mang đến hương vị mới cho bữa ăn gia đình<img src="https://cdn.tgdd.vn/Products/Images/7170/229112/bhx/ca-vien-tan-viet-sin-goi-200g-202011111120404612.jpg" alt=""/>\n	0
91	Bò viên chiên Hoa Doanh gói 200g	116	10	2021-09-13	\N	31000	Bò viên Hoa Doanh luôn đảm bảo sử dụng nguyên liệu tươi ngon, an toàn cho sức khoẻ. Bò viên Hoa Doanh gói 200g với đặc điểm dai giòn, thơm ngon với hương vị bò đặc trưng. Bò viên thích hợp để nấu lẩu, chiên ăn vặt hoặc chế biến thành các món ăn ngon miệng khác.<img src="https://cdn.tgdd.vn/Products/Images/7170/228380/bhx/bo-vien-hoa-doanh-goi-200g-202009231033160014.jpg" alt=""/>\n	0
92	Chả mực Hạ Long Oceangift 240g	116	10	2021-09-13	\N	105000	Với phần chả mực dai dai sần sần, thơm ngon đầy kích thích hoà cùng nước chấm tương ớt cay ngon hấp dẫn đến từ thương hiệu chả cá Oceangift. Chả mực Hạ Long Oceangift không chỉ là một loại chả cá tươi ngon, thích hợp cho mọi bữa ăn mà còn cung cấp nguồn năng lượng tuyệt vời.<img src="https://cdn.tgdd.vn/Products/Images/7170/244107/bhx/cha-muc-ha-long-oceangift-khay-240g-202107031547159458.jpg" alt=""/>\n	0
65	Thịt ba rọi heo tươi C.P khay 5000g	113	0	2021-09-12	2021-09-21	96000	<b>Ba rọi heo của thương hiệu CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm, đảm bảo chất lượng, độ tươi ngon. Thịt heo mềm, vân nạc, mỡ rõ ràng nên rất phù hợp làm nguyên liệu để nấu thịt kho hột vịt, thịt nướng BBQ. Có thể dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc.<img src="https://cdn.tgdd.vn/Products/Images//8781/228329/bhx/files/th%E1%BB%8Bt-heo1.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: ba rọi kho măng, ba rọi chiên sả, ba rọi kho dừa, ba rọi chiên sả ớt, ba rọi chiên muối,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý:</b> Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
93	Chả cá chiên sẵn M.ngon gói 300g	116	10	2021-09-13	\N	59000	Là chả cá được chế biến từ những nguyên liệu cá tươi ngon, mang đến chất lượng và hương vị tươi ngon đặc trưng đến từ thương hiệu M.Ngon. Sản phẩm Chả cá chiên M.ngon gói 300g là sự hoà quyện giữa phần chả cá đặc trưng dai giòn với hương vị thơm lừng đặc trưng.<img src="https://cdn.tgdd.vn/Products/Images/7170/241096/bhx/cha-ca-chien-mngon-goi-300g-202106100955417933.jpg" alt=""/>\n	0
94	Chả cá quết Nha Trang Cầu Tre 280g	116	10	2021-09-13	\N	50000	Chả cá quết được dùng để chế biến kèm với các món ăn khác như lẩu, xào chung với các loại rau củ, hấp, và các món ăn khác, là nguyên liệu tiện lợi cho bữa ăn đến từ Cầu Tre. Chả cá quết kiểu Nha Trang Cầu Tre gói 280g được chế biến từ nguồn nguyên liệu chất lượng, an toàn, được lựa chon kỹ càng.<img src="https://cdn.tgdd.vn/Products/Images/7170/204351/bhx/cha-ca-quet-kieu-nha-trang-cau-tre-goi-280g-201906251130575300.jpg" alt=""/>\n	0
95	Chả mực Hạ Long La Cusina gói 250g	116	10	2021-09-13	\N	129000	Là chả mực được chế biến từ những nguyên liệu mực tươi ngon, mang đến chất lượng và hương vị tươi ngon đặc trưng đến từ thương hiệu La Cusina. Sản phẩm Chả mực hạ long La Cusina gói 250g là sự hoà quyện giữa phần chả mực dai giòn sừn sựt với hương vị thơm lừng đặc trưng.<img src="https://cdn.tgdd.vn/Products/Images/7170/239111/bhx/cha-muc-ha-long-la-cusina-goi-250g-202105161651427280.jpg" alt=""/>\n	0
96	Bò viên chiên dai giòn C.P 500g	116	10	2021-09-13	\N	69000	Là sản phẩm cao cấp đến từ thương hiệu CP</b>, vô cùng quen thuộc với người dùng. Bò viên C.P gói 500g được chế biến từ thành phần cá tươi, không chất bảo quản, an toàn cho sức khỏe người sử dụng. Bò viên có hương vị thơm ngon, dễ ăn và là một trong những món khoái khẩu của giới trẻ hiện nay.<img src="https://cdn.tgdd.vn/Products/Images/7170/220396/bhx/bo-vien-cp-goi-500g-202004071115148827.jpg" alt=""/>\n	0
97	Chả cá viên chiên SG Food gói 500g	116	10	2021-09-13	\N	75000	Thương hiệu chả cá SG Food với công thức chế biến độc đáo, sản phẩm đảm bảo giữ nguyên hương vị thơm ngon của từng viên chả cá. Cá viên SG Food gói 500g được chế biến từ nguyên liệu cá tươi ngon kết hợp cùng các loại gia vị độc đáo, dễ dàng chế biến các món ăn chiên, sốt, nấu lẩu,...<img src="https://cdn.tgdd.vn/Products/Images/7170/218367/bhx/cha-ca-vien-sg-food-goi-500g-202002030917127362.jpeg" alt=""/>\n	0
98	Chả cá hấp Hapi Phạm Nghĩa 200g	116	10	2021-09-13	\N	31500	Sản phẩm vừa là món ăn vặt phổ biến lại vừa là nguyên liệu quen thuộc để chế biến thành nhiều món ăn khác nhau. Chả cá hấp Hapi Phạm Nghĩa gói 200g được chế biến hoàn toàn từ thịt cá tươi sống được tẩm ướp sẵn, mang đến vị cay nhẹ từ tiêu hòa cùng với hương thơm từ hành lá băm nhuyễn<img src="https://cdn.tgdd.vn/Products/Images/7170/231315/bhx/cha-ca-hap-hapi-pham-gia-goi-200g-202012051112531383.jpg" alt=""/>\n	0
99	Chả ốc nhồi basa Nhất Tâm gói 500g	116	10	2021-09-13	\N	61000	Chả cá basa tươi ngon cùng phần thịt ốc bươu giòn ngon sừn sựt đến từ thương hiệu chả cá Nhất Tâm. Chả ốc nhồi basa Nhất Tâm gói 500g là sự lựa chọn không thể bỏ qua của các bà nội trợ trong những ngày bận rộn, mang lại bữa ăn ngon miệng và giàu dinh dưỡng.<img src="https://cdn.tgdd.vn/Products/Images/7170/249021/bhx/cha-oc-nhoi-nhat-tam-goi-500g-202108150727030237.jpg" alt=""/>\n	0
125	test	153	3000	2021-09-19	\N	3000	test	0
100	Chả cá quết dạng viên Cầu Tre 500g	116	10	2021-09-13	\N	75000	Chả cá quết được dùng để chế biến kèm với các món ăn khác như lẩu, xào chung với các loại rau củ, hấp, và các món ăn khác, là nguyên liệu tiện lợi cho bữa ăn đến từ Cầu Tre. Chả cá quết dạng viên Cầu Tre gói 500g được chế biến từ nguồn nguyên liệu chất lượng, an toàn, được lựa chon kỹ càng.<img src="https://cdn.tgdd.vn/Products/Images/7170/228378/bhx/cha-ca-quet-dang-vien-cau-tre-goi-500g-202009231037091726.jpg" alt=""/>\n	0
101	Chả cá viên Hoa Doanh gói 500g	116	10	2021-09-13	\N	57000	Cá viên Hoa Doanh luôn đảm bảo sử dụng nguyên liệu tươi ngon, an toàn cho sức khoẻ. Cá viên Hoa Doanh gói 500g với đặc điểm dai mềm, thơm ngon với hương vị chả cá đặc trưng. Chả cá thích hợp để nấu lẩu, chiên ăn vặt hoặc chế biến thành các món ăn ngon miệng khác.<img src="https://cdn.tgdd.vn/Products/Images/7170/222391/bhx/ca-vien-hoa-doanh-goi-500g-202108051142042390.jpg" alt=""/>\n	0
102	Cá viên nhân trứng cá SG Food 250g	116	10	2021-09-13	\N	49000	Thương hiệu chả cá SG Food với công thức chế biến độc đáo, sản phẩm đảm bảo giữ nguyên hương vị thơm ngon của từng viên chả cá. Cá viên nhân trứng cá SG Food gói 250g được chế biến từ nguyên liệu cá tươi ngon kết hợp với nhân trứng cá độc đáo, dễ dàng chế biến các món ăn chiên, sốt, nấu lẩu,...<img src="https://cdn.tgdd.vn/Products/Images/7170/229128/bhx/-202105161646110356.jpg" alt=""/>\n	0
103	Bò viên chiên Tân Việt Sin 200g	116	10	2021-09-13	\N	46000	Bò viên Tân Việt Sin luôn mang đến những loại bò viên tươi ngon và giàu chất dinh dưỡng. Bò viên Tân Việt Sin gói 200g làm từ nguyên liệu chả thịt bò tươi ngon kết hợp với các loai gia vị, có thể đa dạng sử dụng chế biến: nướng, chiên hoặc nấu lẩu mang đến hương vị mới cho bữa ăn gia đình<img src="https://cdn.tgdd.vn/Products/Images/7170/229138/bhx/bo-vien-tan-viet-sin-goi-200g-202011101111268654.jpg" alt=""/>\n	0
104	Chả tôm viên Tân Việt Sin gói 200g	116	10	2021-09-13	\N	36000	Tôm viên Tân Việt Sin luôn mang đến những loại tôm viên tươi ngon và giàu chất dinh dưỡng. Tôm viên Tân Việt Sin gói 200g làm từ nguyên liệu từ tôm, surimi,... kết hợp với các loai gia vị, có thể đa dạng sử dụng chế biến: nướng, chiên hoặc nấu lẩu mang đến hương vị mới cho bữa ăn gia đình<img src="https://cdn.tgdd.vn/Products/Images/7170/229109/bhx/tom-vien-tan-viet-sin-goi-200g-202011101118007455.jpg" alt=""/>\n	0
105	Thịt gà kho sả ớt 3F khay 390g	115	10	2021-09-13	\N	42000	Thịt gà kho sả ớt 3F khay 390g gồm:Thịt gàGói xốt có gia vị Sả băm, ớt, tỏi Gà ram sả ớt với nước sốt sền sệt, mằn mặn, cay the và thơm nồng mùi sả, nếu ăn có thêm chén cơm trắng thì không còn gì tuyệt vời hơn. Nhưng bạn loay hoay mãi chẳng biết phải ướp như thế nào để gà ram được chuẩn vị, để Family Store giúp bạn bằng hộp gà ram sả ớt chế biến sẵn nhé, chỉ với vài bước đơn giản, bạn đã có ngay cho mình đĩa gà ram thơm ngon, chuẩn vị, cực hao cơm.<img src="https://cdn.tgdd.vn/Products/Images/8791/238286/bhx/thit-ga-kho-sa-ot-khay-390g-202106120403553168.jpg" alt=""/>\n	0
106	Su su tươi non làm sẵn khay 300g	115	10	2021-09-13	\N	5500	Su su làm sẵn khay 300g gồm su su, hành lá, ngò rí, ớt. Đây là món ăn đơn giản, chế biến nhanh chóng nhưng lại cung cấp chất xơ dồi dào. Sản phẩm tươi ngon được đóng khay sơ chế sạch sẽ, đảm bảo an toàn thực phẩm. Thích hợp cho gia đình bận rộn, vô cùng tiện lợi<img src="https://cdn.tgdd.vn/Products/Images/8791/234975/bhx/su-su-lam-san-khay-300g-202103021202405112.jpg" alt=""/>\n	0
107	Phô mai que Mozzarela VuiVui 250g	115	10	2021-09-13	\N	55000	Phô mai que là một món ăn được ưa thích được làm từ phô mai cắt thanh dài, tẩm bột và chiên xù. Thương hiệu thực phẩm chế biến sẵn VuiVui đã mang đến cho người tiêu dùng sản phẩm phô mai que khay 250g cực kỳ tiện lợi mà lại rất ngon.<img src="https://lh5.googleusercontent.com/N2NcAq4EziE-OXfQF0rTuhmsgmc-GgADqNrMd13h-kBNzLkGzdbMkgQE-qBGaZ1ICr5KENEnoTmhdmXa_EIN_Zt8wKD5z8gG_oJKtGTZ_QJBANbUjzBy7fuCuKKP6IsKbAT1T8CT" alt=""/>\n	0
108	Nhân burger đậu nành CK Food 260g	115	10	2021-09-13	\N	130000	Là loại thực phẩm làm sẵn chay được chế biến với nguyên liệu chính là đậu nành cùng những thành phần an toàn cho sức khoẻ. Burger đậu thuần chay CK Food hộp 260g được phân phối bởi thực phẩm CK Food, thích hợp làm nhân cho hamburger chay, bánh mì, món ăn thuần chay.<img src="https://cdn.tgdd.vn/Products/Images/7259/243154/bhx/burger-dau-thuan-chay-ck-food-hop-260g-202107011021427657.jpg" alt=""/>\n	0
109	Nhân burger tiêu đen CK Food 260g	115	10	2021-09-13	\N	130000	Là loại thực phẩm làm sẵn chay được chế biến với nguyên liệu chính là đậu nành cùng những thành phần an toàn cho sức khoẻ. Nhân burger đậu nành tiêu đen thuần chay CK Food hộp 260g được phân phối bởi thực phẩm CK Food, thích hợp làm nhân cho hamburger chay, bánh mì, món ăn thuần chay.<img src="https://cdn.tgdd.vn/Products/Images/7259/243138/bhx/burger-dau-nanh-tieu-den-thuan-chay-ck-food-hop-260g-202107011020377316.jpg" alt=""/>\n	0
83	Xà lách lô lô xanh tươi gói 300g	114	10	2021-09-13	\N	13400	Xà lách lolo xanh có vị ngọt đắng, tính mát và thơm nhẹ, kết cấu lá giòn. Là loại rau chứa nhiều vitamin, khoáng chất, rất tốt cho sức khỏe, được nhiều chị em lựa chọn trong thực đơn bữa ăn gia đình. Có tác dụng giải nhiệt, lọc máu, kích thích tiêu hóa, giảm đau, trị bệnh mất ngủ, chống ho. Loại rau xà lách lolo này thích hợp ăn sống và làm các món salad trộn: xà lách trộn dầu giấm, trộn thịt bò, trứng,...<img src="https://cdn.tgdd.vn/Products/Images//8820/226900/bhx/files/xa-lach-lolo-xanh-tui-500g-202009300006161480.jpg" alt=""/>\n	0
84	Hành tây Đà Lạt túi 500g (2-4 củ)	114	10	2021-09-13	\N	17500	Hành tây là loại củ mọc dưới lòng đất, được trồng phổ biến trên toàn thế giới và có quan hệ gần với hẹ, tỏi và hành lá. Đây là nguyên liệu chủ yếu trong nhiều món ăn, được chế biến rất đa dạng, từ nướng, luộc, chiên, rang, xào, lăn bột hoặc thậm chí là ăn sống. Hành tây chứa khá nhiều vitamin và khoáng chất có công dụng cho sức khỏe như: giúp điều hòa đường huyết, cải thiện sức khỏe xương, ngăn ngừa ung thư, tăng cường hệ miễn dịch,...<img src="https://cdn.tgdd.vn/Products/Images//8788/226936/bhx/files/hanh-tay-da-lat-tui-500g-202010051642026506.jpg" alt=""/>\n	0
85	Củ gừng tươi VN đóng gói 50gr	114	10	2021-09-13	\N	13400	Gừng là một loài thực vật hay được dùng làm gia vị, thuốc. Trong củ gừng có các hoạt chất: Tinh dầu zingiberen, chất nhựa, chất cay, tinh bột. Chính tinh dầu này làm món ăn thơm ngon hơn, khử đi mùi tanh của thịt cá. Không những vậy, gừng có vị cay, tính ôn, kích thích vị giác, tạo cảm giác thèm ăn, khiến bữa ăn thêm ngon miệng. Bên cạnh đó những lợi ích từ gừng như: làm ấm cơ thể, trừ hàn, tiêu đàm, dịu ho, cầm máu, giúp giảm các cơn đau cơ, viêm khớp, thấp khớp, đau đầu hay đau nửa đầu.<img src="https://cdn.tgdd.vn/Products/Images//8785/222875/bhx/files/gung-200g-202009292351137774.jpg" alt=""/>\n	0
88	Rau cần tàu (cần ta) túi 100g	114	10	2021-09-13	\N	5900	Rau cần ta hay còn gọi là  là một trong những loại rau xanh được các chuyên gia dinh dưỡng khuyên dùng bởi những lợi ích mà nó mang lại. Thân cây xốp, mềm, màu trắng, xanh nhạt hoặc huyết dụ và được chia làm nhiều đốt. Phần thân giữa ở các đốt sẽ rỗng ở bên trong, còn những đốt trên ngọn thường chỉ mang một lá. Lá cần ta màu xanh đậm, mọc so le và chia thành nhiều thùy. Hai bên mép có hình răng cưa và có bẹ lá to ôm lấy thân, mọc bò dài ngập trong bùn, bén rễ ở những mấu. Theo Đông y ghi nhận, cần ta có vị ngọt, hơi cay, tính mát, có tác dụng thanh nhiệt, giải độc, làm mát máu, hạ huyết áp,...<img src="https://cdn.tgdd.vn/Products/Images/8820/222874/bhx/rau-can-tau-can-ta-tui-400g-202102011344432916.jpg" alt=""/>\n	0
68	Nạc dăm heo tươi C.P khay 500g	113	8	2021-09-12	2021-09-21	82000	<b>Nạc dăm heo CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm, đảm bảo chất lượng, độ tươi ngon. Thịt mềm nên thường được dùng để luộc hoặc xào với rau củ quả, hoặc thái lát mỏng để chiên xù.... Có thể dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc, xuất xứ.<img src="https://cdn.tgdd.vn/Products/Images//8781/228331/bhx/files/th%E1%BB%8Bt-heo1(1).jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: thịt kho dưa cải, thịt heo chiên bì, thịt heo chiên nước mắm kiểu Thái, đậu que xào thịt, thịt heo xào chua ngọt, thịt kho su hào, thịt kho quẹt,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
64	Thịt nạc vai heo C.P khay 300g	113	2	2021-09-12	2021-09-21	45000	<b>Nạc vai heo  của thương hiệu CP</b> được đóng gói và bảo quản theo những tiêu chuẩn nghiêm ngặt về vệ sinh và an toàn thực phẩm, đảm bảo về chất lượng, độ tươi và ngon của thực phẩm, xuất xứ rõ ràng. Thịt vai heo ít mỡ, mềm và mọng nước nên thường được chế biến thành thịt luộc, thịt kho tiêu,..<img src="https://cdn.tgdd.vn/Products/Images/8781/241258/bhx/nac-vai-heo-cp-khay-300g-202106021659342357.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3> Nấu chính trước khi sử dụng. Một số món ăn ngon từ thịt vai heo như: Thịt heo chiên nước mắm kiểu Thái, thịt heo sốt cà, thịt heo kho nghệ, thịt chiên sả ớt,...<br/>   <b>Lưu ý</b>: Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày\n	0
69	Sườn cốt lết heo C.P khay 500g	113	9	2021-09-12	2021-09-18	80000	<b>Sườn cốt lết CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm, đảm bảo chất lượng, độ tươi ngon. Bản sườn to, dày và thịt mềm thích hợp để nướng hoặc làm sườn ram mặn ăn với cơm trắng. Có thể dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc.<img src="https://cdn.tgdd.vn/Products/Images//8781/228332/bhx/files/th%E1%BB%8Bt-heo-2.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: Thịt heo chiên xù, thịt heo chiên nước mắm kiểu Thái, thịt heo sốt cà,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
72	Chân giò heo sau C.P khay 500g	113	10	2021-09-13	\N	65000	<b>Chân giò heo sau CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm. Giò heo săn chắc, thịt có sự kết hợp với gân mỡ nên ăn béo ngậy và thơm, thích hợp để hầm canh, nấu các món nước như hủ tiếu, bánh canh,... Có thể dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc.<img src="https://cdn.tgdd.vn/Products/Images//8781/228330/bhx/files/th%E1%BB%8Bt-heo1.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: giò heo hầm nấm đông cô, hủ tiếu giò heo, bún giò heo, bún riêu giò heo, chân giò kho, bánh canh giò heo,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
73	Thịt thăn heo C.P tươi khay 300g	113	10	2021-09-13	\N	54000	<b>Thịt thăn heo của thương hiệu CP</b> được đóng gói và bảo quản theo những tiêu chuẩn nghiêm ngặt về vệ sinh và an toàn thực phẩm, đảm bảo về chất lượng, độ tươi và ngon của thực phẩm, xuất xứ rõ ràng. Với đặc tính mềm, khá mọng nước nên rất được ưa chuộng bởi những người có chế độ ăn kiêng, giảm cân.<img src="https://cdn.tgdd.vn/Products/Images/8781/241263/bhx/thit-bap-gio-cp-khay-500g-202106021709254616.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: chà bông heo (ruốc heo), thịt heo áp chảo, thịt thăn heo chiên xù,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
70	Thịt đùi heo tươi C.P khay 500g	113	9	2021-09-12	2021-09-20	80000	<b>Thịt đùi heo CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm, đảm bảo chất lượng, độ tươi ngon. Thịt đùi chủ yêu là phần nạc nên rất phù hợp cho người có chế độ ăn kiêng, giảm cân giữ dáng. Có thể luộc, xào, chiên hoặc kho tuỳ thích. Dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc<img src="https://cdn.tgdd.vn/Products/Images//8781/228334/bhx/files/th%E1%BB%8Bt-heo1.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chính trước khi sử dụng. Một số món ăn ngon từ thịt đùi heo như: Thịt heo chiên nước mắm kiểu Thái, thịt heo sốt cà, thịt heo kho nghệ, thịt chiên sả ớt,... <h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
67	Thịt heo xay sẵn C.P khay 500g	113	8	2021-09-12	2021-09-20	84000	<b>Thịt heo xay CP</b> là loại thịt rất quen thuộc với mỗi bà nội trợ nhờ độ linh hoạt cao trong chế biến, lại nhanh thấm gia vị và có khả năng kết hợp hài hòa với hầu hết các loại rau củ, cho các đầu bếp tại gia thỏa sức biến tấu. Sản phẩm được kết hợp từ thịt nạc và mỡ tươi sạch tạo sự hài hòa cho hương vị và sự an tâm tuyệt đối về chất lượng cho các món ăn.Thịt heo xay dùng để chế biến những món ngon như: cháo thịt băm với gừng tươi, canh bí đao thịt băm, cháo trứng bắc thảo thịt băm,...<img src="https://cdn.tgdd.vn/Products/Images//8781/228332/bhx/files/th%E1%BB%8Bt-heo-2.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Thịt heo xay dùng để chế biến những món ngon như: cháo thịt băm với gừng tươi, canh bí đao thịt băm, cháo trứng bắc thảo thịt băm,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
75	Nạc dăm heo tươi C.P khay 300g	113	10	2021-09-13	\N	49000	<b>Nạc dăm heo CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm, đảm bảo về chất lượng, độ tươi ngon. Nạc dăm mềm nên thường dùng để làm thịt luộc cuốn với bánh tráng hoặc kho với trứng,.. Có thể dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc.<img src="https://cdn.tgdd.vn/Products/Images//8781/226840/bhx/files/th%E1%BB%8Bt-heo1(1).jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: thịt kho dưa cải, thịt heo chiên bì, thịt heo chiên nước mắm kiểu Thái, đậu que xào thịt, thịt heo xào chua ngọt, thịt kho su hào, thịt kho quẹt,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
76	Thịt đùi heo tươi C.P khay 300g	113	10	2021-09-13	\N	48000	<b>Thịt đùi heo CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm, đảm bảo chất lượng, độ tươi ngon. Thịt đùi chủ yêu là phần nạc nên rất phù hợp cho người có chế độ ăn kiêng, giảm cân giữ dáng. Có thể luộc, xào, chiên hoặc kho tuỳ thích. Dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc<img src="https://cdn.tgdd.vn/Products/Images//8781/226860/bhx/files/th%E1%BB%8Bt-heo1.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chính trước khi sử dụng. Một số món ăn ngon từ thịt đùi heo như: Thịt heo chiên nước mắm kiểu Thái, thịt heo sốt cà, thịt heo kho nghệ, thịt chiên sả ớt,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
86	Ớt hiểm nguyên trái túi 50g 	114	10	2021-09-13	\N	9700	Với vị cay nồng, thơm, kích thích vị giác của người ăn, ớt là một trong những gia vị không thể thiếu trong nấu ăn cũng như mâm cơm của người Việt. Ớt hiểm của Family Store luôn giữ được độ tươi mỗi ngày, được nuôi trồng theo quy trình nghiêm ngặt, bảo đảm các chỉ tiêu về an toàn và chất lượng.Ớt mang một vị cay đặc trưng, cùng với hành, tỏi, và các loại rau nêm khác trở thành nguyên liệu không thể thiếu trong mỗi món ăn, giúp các món ăn cay nồng, dậy mùi thêm phần hấp dẫn. Người ta có thể dùng ớt ở bất kể món ăn nào nếu muốn có thêm vị cay cay the the, có người còn ăn ớt sống, mỗi bữa cơm hai trái như thói quen để kích thích vị giác, giúp ăn ngon miệng hơn. Ớt có nhiều loại, nhưng phải nói là cay nhất thì chỉ có ớt hiểm, chính là loại quả ớt thường mọc quả có 3 màu trắng, đỏ, vàng trên cùng một cây. <img src="https://cdn.tgdd.vn/Products/Images//8786/226884/bhx/files/ot-hiem-goi-50g-202009300018050542.jpg" alt=""/>\n	0
77	Nấm mỡ nâu Yoshi tươi hộp 150g	114	10	2021-09-13	\N	69000	Nấm mỡ nâu của Family Store được nuôi trồng và đóng gói theo những tiêu chuẩn nghiêm ngặt, bảo đảm các tiêu chuẩn xanh - sach, chất lượng và an toàn với người dùng. Chứa hàm lượng dinh dưỡng dồi dào, vị nấm ngọt dịu, thịt nấm giòn chắc thích hợp để nấu lẩu, xào cùng rau củ hoặc nấu các loại súp.<img src="https://cdn.tgdd.vn/Products/Images/8820/233786/bhx/nam-mo-nau-hop-150g-202101292220232803.jpg"/><h3>ƯU ĐIỂM CỦA NẤM MỠ</h3><ul><li>Giàu vitamin và các khoáng chất quan trọng cho hoạt động của cơ thể.</li><li>Giảm chán chán ăn, mệt mỏi, sản phụ thiếu sữa, suy giảm bạch cầu, viên phế quản và viêm gan mạn tính,…</li><li>Chất PS-K trong nấm có công dụng kháng ung thư (đã được các nhà khoa học khảo nghiệm cực hiệu quả).</li><li>Là một loại thực phẩm giàu giá trị dinh dưỡng hơn thịt, cá, trứng, rau và sữa.</li></ul><h3>Hướng dẫn bảo quản</h3> Sử dụng trong vòng 7 ngày kể từ ngày đóng gói.<br/>\n	0
78	Khoai lang Nhật dẻo ngọt túi 1kg	114	10	2021-09-13	\N	29000	Là món ăn được rất nhiều người yêu thích, được trồng và có củ quanh năm, ngon nhất là khi được nướng lên trên một bếp than đổ hồng. Loại củ này có vị ngọt ngào như mật, tan tan trên đầu lưỡi. Khoai lang Nhật chứa nhiều vitamin A, B, C và nhiều khoáng chất cần thiết cho làn da đẹp.Khoai lang Nhật là một loại củ có hình dáng thon, dài. Với lớp vỏ bên ngoài màu tím, trong ruột thì vàng, hương vị ngọt dịu nhẹ, bùi nên chiếm được rất nhiều cảm tình của mọi người. Trong Đông y củ khoai lang có vị ngọt, tính bình, có công dụng nhuận tràng, bồi bổ cơ thể, tiêu viêm, lợi mật, sáng mắt,.. đặc biệt ăn khoai vào buổi sáng sẽ giúp bạn cung cấp đầy đủ dinh dưỡng cho cơ thể, đặc biệt là chữa được nhiều bệnh nguy hiểm mà bạn không ngờ tới.<img src="https://i.ytimg.com/vi/Vwk0mr6jIr0/maxresdefault.jpg" alt=""/>\n	0
79	Nấm hải sản Việt Nam tươi túi 150g	114	10	2021-09-13	\N	25000	Nấm hải sản của Family Store được nuôi trồng và đóng gói theo những tiêu chuẩn nghiêm ngặt, bảo đảm các tiêu chuẩn xanh - sach, chất lượng và an toàn với người dùng. Nấm trắng ngần, ngọt, chứa nhiều chất, hàm lượng dinh dưỡng cao nên thường dùng để nấu cháo hoặc làm rau nhúng lẩu.Nấm hải sản còn có tên gọi khác nấm bạch tuyết. Đây được xem là một loại thực phẩm rất tốt cho sức khỏe bởi nó chứa rất nhiều vitamin và protein. Thực phẩm này còn có rất nhiều tác dụng trong việc ngăn ngừa ung thư, thông gan, tốt cho dạ dày, tăng cường trí lực, giảm quá trình lão hóa, tăng cường hệ miễn dịch của cho mẹ bầu…<img src="https://cdn.tgdd.vn/Products/Images//8820/226954/bhx/files/nam-hai-san-goi-150g-202010011945101662.jpg" alt=""/>\n	0
135	test	154	3666	2021-09-21	\N	3666	test	0
136	test2	156	3666	2021-09-21	\N	3666	test	0
137	test 2	154	3666	2021-09-21	\N	3666	test	0
82	Dưa leo tươi túi 500g (2-4 trái)	114	10	2021-09-13	\N	17400	Được trồng khá nhiều ở nước ta, đây là một loại rau củ rất ngon, gần như là quen thuộc trong tất cả bữa ăn ở mọi gia đình. Dưa leo chứa rất nhiều chất dinh dưỡng và vitamin rất tốt cho cơ thể. Ngoài ra, dưa leo còn có thể dụng để làm đẹp cũng rất hiệu quả.    Dưa leo hay còn gọi là dưa chuột, là một loại quả thuộc họ Bầu bí, khi ăn có vị ngọt nhẹ và thanh mát. Đây là loại quả có hàm lượng nước và chất xơ cao cùng với các khoáng chất có lợi cho sức khỏe. Vì thế, dưa leo không chỉ được dùng như một loại nguyên liệu chế biến món ăn mà còn được xem là một thần dược trong việc làm đẹp. <img src="https://cdn.tgdd.vn/Products/Images//8785/226881/bhx/images/dua-leo-vi-500g-202009292350252470.jpg" alt=""/>\n	0
56	Sườn non heo tươi C.P khay 500g	113	8	2021-09-11	2021-09-21	109000	<b>Sườn non CP</b> đạt các tiêu chuẩn về an toàn toàn thực phẩm, đảm bảo chất lượng, độ tươi ngon. Sườn được cắt sẵn miếng vừa ăn, có thể chế biến thành nhiều món ngon như sườn kho tiêu, sườn nấu canh, sườn xào chua ngọt,..... Có thể dùng điện thoại quét mã QR trên tem sản phẩm để kiểm tra nguồn gốc.<img src="https://cdn.tgdd.vn/Products/Images//8781/228333/bhx/files/2.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: sườn non hầm khoai môn, lagu sườn non, sườn non rim mặn, canh cải chua sườn non, canh chùm ngây sườn non,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý:</b> Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
140	kemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm	113	1	2021-09-22	\N	10000		0
66	Sườn non heo tươi C.P khay 300g	113	10	2021-09-12	\N	88000	<b>Sườn non heo của thương hiệu CP</b> được đóng gói và bảo quản theo những tiêu chuẩn nghiêm ngặt về vệ sinh và an toàn thực phẩm, đảm bảo về chất lượng, độ tươi và ngon của thực phẩm, xuất xứ rõ ràng. Sườn mềm, thơm, ngọt thịt nên thường dùng để làm sườn non ram mặn hoặc hầm canh với rau củ.<img src="https://cdn.tgdd.vn/Products/Images//8781/226853/bhx/files/th%E1%BB%8Bt-heo1.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món ăn như: sườn non hầm khoai môn, lagu sườn non, sườn non rim mặn, canh cải chua sườn non, canh chùm ngây sườn non,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
74	Thịt heo xay sẵn C.P khay 300g	113	9	2021-09-13	2021-09-20	50000	<b>Thịt heo xay CP</b> là loại thịt rất quen thuộc với mỗi bà nội trợ nhờ độ linh hoạt cao trong chế biến, lại nhanh thấm gia vị và có khả năng kết hợp hài hòa với hầu hết các loại rau củ, cho các đầu bếp tại gia thỏa sức biến tấu. Sản phẩm được kết hợp từ 80% nạc và 20% mỡ tươi sạch tạo sự hài hòa cho hương vị và sự an tâm tuyệt đối về chất lượng cho các món ăn.Thịt heo xay dùng để chế biến những món ngon như: cháo thịt băm với gừng tươi, canh bí đao thịt băm, cháo trứng bắc thảo thịt băm,...<img src= "https://cdn.tgdd.vn/Products/Images//8781/228332/bhx/files/th%E1%BB%8Bt-heo-2.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Thịt heo xay dùng để chế biến những món ngon như: cháo thịt băm với gừng tươi, canh bí đao thịt băm, cháo trứng bắc thảo thịt băm,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	0
71	Móng giò heo trước CP khay 500g 	113	5	2021-09-12	2021-09-21	74000	<b>Móng giò heo của thương hiệu CP</b> được đóng gói và bảo quản theo những tiêu chuẩn nghiêm ngặt về vệ sinh và an toàn thực phẩm, đảm bảo về chất lượng, độ tươi và ngon của thực phẩm, xuất xứ rõ ràng.Lớp da giòn, béo kết hợp với gân mềm nên thường được sử dụng để hầm các loại canh bổ dưỡng.<img src="https://cdn.tgdd.vn/Products/Images//8781/226853/bhx/files/th%E1%BB%8Bt-heo-2.jpg" alt=""/><h3>Hướng dẫn sử dụng</h3>Nấu chín trước khi sử dụng hoặc chế biến thành một số món hầm bồi bổ sức khoẻ như bún móng giò, móng giò kho trứng cút,...<h3>Hướng dẫn bảo quản</h3>Bảo quản ở nhiệt độ 0 - 4 độ C, thời hạn sử dụng 3 ngày.<br/><b>Lưu ý: </b>Sản phẩm nhận được có thể khác với hình ảnh về màu sắc và số lượng nhưng vẫn đảm bảo về mặt khối lượng và chất lượng.\n	1
111	Ba khía muối Nhất Tâm hũ 400g	115	10	2021-09-13	\N	111000	Là loại thực phẩm ăn liền vô cùng thơm ngon và tiện lợi đến từ thương hiệu thực phẩm Nhất Tâm quen thuộc. Ba khía muối Nhất Tâm hũ 400g mang đến hương vị miền quê dân dã, mộc mạc nhưng lại kích thích vị giác và mang đến giá trị dinh dưỡng cao cho bữa ăn của mỗi gia đình.<img src="https://cdn.tgdd.vn/Products/Images/7259/247201/bhx/ba-khia-muoi-nhat-tam-hu-400g-202108161723222955.jpg" alt=""/>\n	0
112	Mắm tôm đất bồn bồn Nhất Tâm 400g	115	10	2021-09-13	\N	108000	Là loại thực phẩm ăn liền vô cùng thơm ngon và tiện lợi đến từ thương hiệu thực phẩm Nhất Tâm quen thuộc. Mắm tôm đất bồn bồn Nhất Tâm hũ 400g mang đến hương vị miền quê dân dã, mộc mạc nhưng lại kích thích vị giác và mang đến giá trị dinh dưỡng cao cho bữa ăn của mỗi gia đình.<img src="https://cdn.tgdd.vn/Products/Images/7259/247222/bhx/mam-tom-dat-bon-bon-nhat-tam-hu-400g-202108161725409430.jpg" alt=""/>\n	0
113	Mắm tôm đất đu đủ Nhất Tâm hũ 400g	115	10	2021-09-13	\N	105000	Là loại thực phẩm ăn liền vô cùng thơm ngon và tiện lợi đến từ thương hiệu thực phẩm Nhất Tâm quen thuộc. Mắm tôm đất đu đủ Nhất Tâm hũ 400g mang đến hương vị miền quê dân dã, mộc mạc nhưng lại kích thích vị giác và mang đến giá trị dinh dưỡng cao cho bữa ăn của mỗi gia đình.<img src="https://cdn.tgdd.vn/Products/Images/7259/247211/bhx/mam-tom-dat-du-du-nhat-tam-hu-400g-202108161724524766.jpg" alt=""/>\n	0
114	Phô mai que Tân Việt Sin gói 400g	115	10	2021-09-13	\N	103000	Là loại thực phẩm làm sẵn giữ nguyên vị tươi ngon và giàu chất dinh dưỡng đến từ thương hiệu thực phẩm làm sẵn Tân Việt Sin. Phô mai que hương sữa Tân Việt Sin gói 400g với phô mai trắng thơm vị sữa bao bọc bởi lớp bột chiên xù giòn rụm,… tạo nên món ăn vặt lý tưởng cho giới trẻ.<img src="https://cdn.tgdd.vn/Products/Images/7259/202435/bhx/pho-mai-que-huong-sua-tan-viet-sin-goi-400g-201905101513133582.jpg" alt=""/>\n	0
115	Tôm uyên ương Oceangift khay 250g	115	10	2021-09-13	\N	99000	Là loại thực phẩm chế biến sẵn, tiện lợi cho gia đình. Với thực phẩm từ Oceangift, bạn hoàn toàn có thể an tâm với nguyên liệu hải sản tươi ngon, đảm bảo an toàn cho người tiêu dùng. Tôm uyên ương Oceangift khay 250g với phần tôm dai ngon giòn rụm cùng nước sốt đầy kích thích. Khối lượng <img src="https://cdn.tgdd.vn/Products/Images/7259/243092/bhx/tom-uyen-uong-oceangift-khay-250g-202107052304441597.jpg" alt=""/>\n	0
116	Đùi gà chiên giòn C.P gói 500g	115	10	2021-09-13	\N	99000	Là loại thực phẩm làm sẵn giàu dinh dưỡng, thơm ngon và kích thích vị giác đến từ thương hiệu thực phẩm chế biến C.P quen thuộc. Đùi gà chiên giòn truyền thống C.P gói 500g được chế biến từ những chiếc đùi gà tươi ngon, được tẩm gia vị và phủ lớp bột chiên xù, thích hợp ăn vặt hoặc ăn cùng cơm trắng...<img src="https://cdn.tgdd.vn/Products/Images/7259/244647/bhx/ga-nugget-vong-chien-gion-sg-food-goi-300g-202107011706210741.jpg" alt=""/>\n	0
117	Đùi gà chiên giòn vị cay C.P 500g	115	10	2021-09-13	\N	99000	Là loại thực phẩm làm sẵn giàu dinh dưỡng, thơm ngon và kích thích vị giác đến từ thương hiệu thực phẩm chế biến C.P quen thuộc. Đùi gà chiên giòn vị cay C.P gói 500g được chế biến từ những chiếc đùi gà tươi ngon, được tẩm gia vị cay và phủ lớp bột chiên xù, thích hợp ăn vặt hoặc ăn cùng cơm trắng.<img src="https://cdn.tgdd.vn/Products/Images/7259/244648/bhx/dui-ga-chien-gion-vi-cay-sg-food-goi-500g-202107011712408704.jpg" alt=""/>\n	0
118	Dồi sụn dai giòn 3brothers 500g	115	10	2021-09-13	\N	98000	Thành phần sụn non, mỡ heo, thịt nạc heo, húng chó, cà rốt, hành tây, gia vị hỗn hợp,... tạo nên hương vị chả đậm đà thơm ngon. Dồi sụn 3brothers gói 500g của 3brothers chất lượng cao, ăn kèm với cơm hoặc trong các bữa tiệc cũng rất ổn. Hương vị thơm ngon, không chất bảo quản.<img src="https://cdn.tgdd.vn/Products/Images/7259/234494/bhx/doi-sun-3brothers-goi-500g-202108090906491272.jpg" alt=""/>\n	0
119	Cá Hamachi xốt gừng Meiwa 350g	115	10	2021-09-13	\N	95000	Là một trong những loại thực phẩm làm sẵn vô cùng tiện lợi đến từ thương hiệu thực phẩm làm sẵn Meiwa cao cấp  đến từ Nhật Bản. Cá Hamachi xốt gừng Meiwa khay 350g được chế biến từ những con cá cam tươi ngon kết hợp với các loại gia vị, mang đến hương vị kho gừng thơm ngon khó cưỡng.<img src="https://cdn.tgdd.vn/Products/Images/7259/230894/bhx/ca-hamachi-xot-gung-meiwa-khay-350g-202011230922024047.jpg" alt=""/>\n	0
120	Rau muống hạt 4KFarm túi 500g	212	10	2021-09-13	\N	11500	Rau muống 4KFarm là loại rau phổ biến và ưa chuộng trong bữa ăn gia đình vì có vị ngọt, tính mát và chứa một lượng lớn vitamin A, C, các chất dinh dưỡng và đặc biệt là hàm lượng chất sắt dồi dào. <img src="https://cdn.tgdd.vn/Products/Images/8784/231574/bhx/rau-muong-4kfarm-tui-200-300g-202102051322204502.jpg" alt=""/>\n	0
\.


--
-- Data for Name: tbl_product_images; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_product_images (prod_img_id, prod_img_product_id, prod_img_data, prod_img_status) FROM stdin;
61	65	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218230/bbe8jcweh59q97cg76te.jpg	0
62	66	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218249/nrstmnidlyxzvvhptaom.jpg	0
63	72	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218331/qyi6gbd9jnoubblgiuec.jpg	0
64	64	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218443/x1njkmmjufip0snbz2zc.jpg	0
65	74	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218509/yajtztjtorl52d9rxtmk.jpg	0
66	76	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218616/u8jazadwdquaiim2pyyk.jpg	0
67	75	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218689/anpobrcszfoy23yvcn9z.jpg	0
68	73	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632218771/fbtbmqeiez55370mpxl0.jpg	0
69	68	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632225973/llpaegm57fbwpnpxubih.jpg	0
70	71	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226004/muwl7zragv5kz8hnqcoe.jpg	0
71	67	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226036/vahjshtkkvqucscij2lg.jpg	0
72	77	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226086/xemh0e3i4kt9buxl5oxb.jpg	0
73	86	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226189/gtamkljmds1u2ujnhvnx.jpg	0
74	88	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226263/yfpceatpwpqlf4dp6een.jpg	0
75	85	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226298/epiemqsuuynn5lzpcok7.jpg	0
76	84	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226343/x1jhevmlrzesmnnjx4mz.jpg	0
77	83	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226369/vk1nvmig10zuxlghi1cy.jpg	0
78	89	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226403/rfl2cbgsq6jn7o8mnuka.jpg	0
79	87	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226443/g3jidmfj7qatu086uas7.jpg	0
80	81	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226482/hn4jmaxw21miqxgop9h6.jpg	0
81	80	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226531/pqr8z4pztxjz6hunmc8a.jpg	0
82	114	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226584/ecotbglyghkttdelzq7y.jpg	0
83	113	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226631/jkozemqknotot5xkywcr.jpg	0
84	112	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226706/e1gbpxjxm3qxwtzmocls.jpg	0
85	111	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226737/j6q7nm7ggphabuyt8gl6.jpg	0
86	109	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226771/mvmquaywpjbegva1otgj.jpg	0
87	108	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226803/puebfu4x16qicrs0q7pl.jpg	0
88	107	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226843/djei1hyr3lwvc3pb9pv5.jpg	0
89	106	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226912/zipi0lr4dgaywtmqhc4k.jpg	0
90	105	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632226952/dm4zz0ntfxcukt5akfcr.jpg	0
91	110	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227011/kbhmepw9elzuk34rsvvt.jpg	0
92	99	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227564/zutymjg2ebauf6quawud.jpg	0
93	98	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227593/ztnfczqcqxslp52biaow.jpg	0
94	97	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227653/og2p97lctcy0fh4v3t3f.png	0
95	96	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227693/qqnqzamia1dktx5iiqe0.jpg	0
96	95	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227720/p6pzyojwyy4ehyrgsl6g.jpg	0
97	94	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227824/hs3wgapsfeephhbepmc6.jpg	0
98	93	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227888/li0lrf6hprlz5j73l9ig.jpg	0
99	92	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227940/wkasc6bks6xhbvi94rxu.jpg	0
100	91	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632227968/ms9ccxqwi9qrgjf6isvs.jpg	0
101	90	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228012/zaywf2mc8j5cqrtchjwa.jpg	0
102	120	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228122/alkqs1vxsiegrl4fqxio.jpg	0
103	70	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228375/gl9fgwjygscedtif503s.jpg	0
104	69	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228443/wieutyakcts570dhl6fr.jpg	0
105	56	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228495/cofgv35haulkgmmji8lr.jpg	0
106	82	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228530/itggsqkb9bitnikqqpdo.jpg	0
50	125	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632026620/pjxf7qkjbewgaw3adfdo.jpg	0
107	78	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228575/vxlyalp7xdpq8xszhcfr.jpg	0
108	79	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228605/kjpyb7pbh7ndr0sl269z.jpg	0
109	101	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228650/xwmqipyyie4jxkim1gmk.jpg	0
110	104	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228689/zy8rmiv3yvh7n0aft0gy.jpg	0
111	135	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228710/iisqqpcj808gkyrrnvef.jpg	0
112	135	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228710/aoyzzk8uiffk05glcldf.jpg	0
113	135	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228710/cybh92vzetqicusywpdg.jpg	0
114	135	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228710/gaohkjas1jfj4irxupi8.jpg	0
115	135	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228710/pu2eow0jlkfhvd37oiq0.jpg	0
116	102	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228715/apfnvyhmbsajwlahhhnm.jpg	0
117	136	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228738/ca5tutaab3umehmbratw.jpg	0
118	136	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228738/xaaue1vvflmq4t5aqqyf.jpg	0
119	136	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228738/cx2c9ojvzquyu9nvygsk.jpg	0
120	136	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228738/ypve6uxcoakixkzcv2eh.jpg	0
121	136	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228738/is8udmlfwqlfery1ocpj.jpg	0
122	100	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228746/ahaza2ugydjxsf7adlle.jpg	0
123	103	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228779/qa6v1d4jjjwkosgpj7w4.jpg	0
124	119	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228843/nh5d3pa2szbanpmjmuyq.jpg	0
125	117	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228888/qzuyygahs0ogjw9nje6z.jpg	0
126	116	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228924/rrhltbqxfkdounmn3vc2.jpg	0
127	137	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228932/hpzpzlwamiul1gpl8i2d.jpg	0
128	137	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228932/ukzm2zwpaex2spcpxkod.jpg	0
129	137	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228932/yh7advq6yu9zwfh92r5q.jpg	0
130	137	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228932/kqg03zqw4cvd1uemzino.jpg	0
131	137	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228932/aqzcwvjcytubsskuhr64.jpg	0
132	115	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632228988/xjjujt1imtcrt2gazxz7.jpg	0
133	118	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1632229027/jrv5tgyhod1aa6zrga0w.jpg	0
\.


--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_roles (rol_id, rol_name, role_status, rol_create_date, rol_update_date) FROM stdin;
ADM	admin	0	2021-07-25	2021-07-25
USER	user	0	2021-08-05	2021-08-05
\.


--
-- Data for Name: tbl_wards; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_wards (ward_id, ward_name, ward_city_id, ward_dis_id, ward_created_date, ward_updated_date, ward_ship_price) FROM stdin;
1	phường Bến Nghé	1	1	2021-09-05	\N	3000000
2	phường Bến Thành	1	1	2021-09-05	\N	3000000
3	phường Tân Địnhh	1	1	2021-09-05	\N	3000000
4	phường Phạm Ngũ Lão	1	1	2021-09-05	\N	3000000
5	phường Nguyễn Thái Bình	1	1	2021-09-05	\N	3000000
6	phường Nguyễn Cư Trinh	1	1	2021-09-05	\N	3000000
7	phường Đa Kao	1	1	2021-09-05	\N	3000000
8	phường Cầu Ông Lãnh	1	1	2021-09-05	\N	3000000
9	phường Cầu Kho	1	1	2021-09-05	\N	3000000
10	phường Cô Giang	1	1	2021-09-05	\N	3000000
11	phường An Phú	1	2	2021-09-05	\N	3000000
12	phường Thảo Điền	1	2	2021-09-05	\N	5000000
13	phường An Khánh	1	2	2021-09-05	\N	6000000
14	phường Bình An	1	2	2021-09-05	\N	7000000
15	phường Thủ Thiêm	1	2	2021-09-05	\N	8000000
16	phường An Lợi Đông	1	2	2021-09-05	\N	2500000
17	phường Bình Trưng Đông	1	2	2021-09-05	\N	3500000
18	phường Bình Trưng Tây	1	2	2021-09-05	\N	4500000
19	phường Thạnh Mỹ Lợi	1	2	2021-09-05	\N	4500000
20	phường Cát Lái	1	2	2021-09-05	\N	5500000
21	phường 1	1	3	2021-09-05	\N	5500000
22	phường 2	1	3	2021-09-05	\N	3500000
23	phường 4	1	3	2021-09-05	\N	3500000
24	phường Võ Thị Sáu	1	3	2021-09-05	\N	7000000
25	phường 6	1	4	2021-09-05	\N	7000000
26	phường 7	1	4	2021-09-05	\N	7000000
27	phường 9	1	5	2021-09-05	\N	1000000
28	phường 10	1	5	2021-09-05	\N	2000000
29	phường 12	1	6	2021-09-05	\N	2000000
30	phường Tân Thuận Đông	1	7	2021-09-05	\N	1000000
31	phường Tân Thuận Tây	1	7	2021-09-05	\N	1000000
32	phường Tây Kiểng	1	7	2021-09-05	\N	1500000
33	phường Cây Sung	1	8	2021-09-05	\N	1500000
34	phường Bình Đông	1	8	2021-09-05	\N	1000000
35	phường Đông Bình	1	9	2021-09-05	\N	500000
36	phường Hiệp Phú	1	9	2021-09-05	\N	400000
37	phường Long Phước	1	9	2021-09-05	\N	200000
38	phường 15	1	10	2021-09-05	\N	200000
39	phường 16	1	11	2021-09-05	\N	200000
40	phường An Phú Đông	1	12	2021-09-05	\N	200000
41	phường Đông Hưng Thuận	1	12	2021-09-05	\N	300000
\.


--
-- Data for Name: tbl_ware_house; Type: TABLE DATA; Schema: public; Owner: ugzmwzwyynriwv
--

COPY public.tbl_ware_house (sto_id, sto_account_id, sto_product_name, sto_amount, sto_category_id, sto_origin_price, sto_created_date, sto_updated_date, sto_product_id, sto_cost, sto_status) FROM stdin;
\.


--
-- Name: tbl_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_account_id_seq', 67, true);


--
-- Name: tbl_bill_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_bill_detail_id_seq', 86, true);


--
-- Name: tbl_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_bill_id_seq', 78, true);


--
-- Name: tbl_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_cart_id_seq', 202, true);


--
-- Name: tbl_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_categories_id_seq', 244, true);


--
-- Name: tbl_cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_cities_id_seq', 1, true);


--
-- Name: tbl_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_comment_id_seq', 26, true);


--
-- Name: tbl_delivery_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_delivery_address_id_seq', 16, true);


--
-- Name: tbl_districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_districts_id_seq', 24, true);


--
-- Name: tbl_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_product_id_seq', 140, true);


--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_product_image_id_seq', 133, true);


--
-- Name: tbl_wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_wards_id_seq', 41, true);


--
-- Name: tbl_ware_house_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ugzmwzwyynriwv
--

SELECT pg_catalog.setval('public.tbl_ware_house_id_seq', 1, false);


--
-- Name: tbl_account tbl_account_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_pkey PRIMARY KEY (acc_id);


--
-- Name: tbl_bill_detail tbl_bill_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_bill_detail
    ADD CONSTRAINT tbl_bill_detail_pkey PRIMARY KEY (bdetail_id);


--
-- Name: tbl_bill tbl_bill_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_bill
    ADD CONSTRAINT tbl_bill_pkey PRIMARY KEY (bill_id);


--
-- Name: tbl_cart tbl_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_cart
    ADD CONSTRAINT tbl_cart_pkey PRIMARY KEY (cart_id);


--
-- Name: tbl_categories tbl_categiries_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categiries_pkey PRIMARY KEY (cate_id);


--
-- Name: tbl_cities tbl_cities_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_cities
    ADD CONSTRAINT tbl_cities_pkey PRIMARY KEY (ci_id);


--
-- Name: tbl_comment tbl_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_comment_pkey PRIMARY KEY (cmt_id, cmt_product_id);


--
-- Name: tbl_delivery_address tbl_delivery_address_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_delivery_address_pkey PRIMARY KEY (del_id);


--
-- Name: tbl_districts tbl_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_districts
    ADD CONSTRAINT tbl_districts_pkey PRIMARY KEY (dis_id, dis_city_id);


--
-- Name: tbl_product_images tbl_product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_product_images_pkey PRIMARY KEY (prod_img_id, prod_img_product_id);


--
-- Name: tbl_product tbl_product_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_pkey PRIMARY KEY (prod_id);


--
-- Name: tbl_roles tbl_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_roles
    ADD CONSTRAINT tbl_roles_pkey PRIMARY KEY (rol_id);


--
-- Name: tbl_wards tbl_wards_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_wards
    ADD CONSTRAINT tbl_wards_pkey PRIMARY KEY (ward_id, ward_city_id, ward_dis_id);


--
-- Name: tbl_ware_house tbl_ware_house_pkey; Type: CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_pkey PRIMARY KEY (sto_id);


--
-- Name: tbl_account tbl_account_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_roles_fkey FOREIGN KEY (acc_role) REFERENCES public.tbl_roles(rol_id);


--
-- Name: tbl_bill_detail tbl_bill_detal_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_bill_detail
    ADD CONSTRAINT tbl_bill_detal_bill_id_fkey FOREIGN KEY (bdetail_bill_id) REFERENCES public.tbl_bill(bill_id);


--
-- Name: tbl_cart tbl_cart_product_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_cart
    ADD CONSTRAINT tbl_cart_product_fkey FOREIGN KEY (cart_prod_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_comment tbl_cmt_acc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_acc_id_fkey FOREIGN KEY (cmt_acc_id) REFERENCES public.tbl_account(acc_id) NOT VALID;


--
-- Name: tbl_comment tbl_cmt_prod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_prod_fkey FOREIGN KEY (cmt_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_delivery_address tbl_del_acc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_del_acc_fkey FOREIGN KEY (del_user_id) REFERENCES public.tbl_account(acc_id);


--
-- Name: tbl_delivery_address tbl_del_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_del_district_id_fkey FOREIGN KEY (del_ward_id, del_district_id, del_city_id) REFERENCES public.tbl_wards(ward_id, ward_dis_id, ward_city_id) NOT VALID;


--
-- Name: tbl_districts tbl_districts_cities_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_districts
    ADD CONSTRAINT tbl_districts_cities_fkey FOREIGN KEY (dis_city_id) REFERENCES public.tbl_cities(ci_id);


--
-- Name: tbl_product_images tbl_prod_img_prod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_prod_img_prod_fkey FOREIGN KEY (prod_img_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_product tbl_product_categories_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_categories_fkey FOREIGN KEY (prod_category_id) REFERENCES public.tbl_categories(cate_id);


--
-- Name: tbl_wards tbl_ward_dis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_wards
    ADD CONSTRAINT tbl_ward_dis_id_fkey FOREIGN KEY (ward_dis_id, ward_city_id) REFERENCES public.tbl_districts(dis_id, dis_city_id);


--
-- Name: tbl_ware_house tbl_ware_house_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_account_fkey FOREIGN KEY (sto_account_id) REFERENCES public.tbl_account(acc_id);


--
-- Name: tbl_ware_house tbl_ware_house_categories_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_categories_fkey FOREIGN KEY (sto_category_id) REFERENCES public.tbl_categories(cate_id);


--
-- Name: tbl_ware_house tbl_ware_house_product_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ugzmwzwyynriwv
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_product_fkey FOREIGN KEY (sto_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ugzmwzwyynriwv
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO ugzmwzwyynriwv;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO ugzmwzwyynriwv;


--
-- PostgreSQL database dump complete
--

