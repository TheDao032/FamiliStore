--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3 (Ubuntu 13.3-1.pgdg20.04+1)
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
-- Name: proc_update_product_insert_bill_detail(json, integer, character varying, integer, timestamp without time zone, integer, text); Type: PROCEDURE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE PROCEDURE public.proc_update_product_insert_bill_detail(listproduct json, accid integer, totalprice character varying, totalquantity integer, timecurrent timestamp without time zone, INOUT resultcode integer, INOUT message text)
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
				bill_created_date
			)
			values(accId, totalPrice, totalQuantity, timeCurrent);
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


ALTER PROCEDURE public.proc_update_product_insert_bill_detail(listproduct json, accid integer, totalprice character varying, totalquantity integer, timecurrent timestamp without time zone, INOUT resultcode integer, INOUT message text) OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_account_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_account_id_seq OWNER TO pnnyoamvocwgoi;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tbl_account; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
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


ALTER TABLE public.tbl_account OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_bill_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_bill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_bill_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_bill; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
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


ALTER TABLE public.tbl_bill OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_bill_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_bill_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_bill_detail_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_bill_detail; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
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


ALTER TABLE public.tbl_bill_detail OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_categories_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_categories; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE TABLE public.tbl_categories (
    cate_id integer DEFAULT nextval('public.tbl_categories_id_seq'::regclass) NOT NULL,
    cate_name character varying(100),
    cate_status integer DEFAULT 0,
    cate_father integer,
    cate_created_date date,
    cate_updated_date date
);


ALTER TABLE public.tbl_categories OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_cities_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_cities_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_cities; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE TABLE public.tbl_cities (
    ci_id integer DEFAULT nextval('public.tbl_cities_id_seq'::regclass) NOT NULL,
    ci_name character varying(50),
    ci_created_date date,
    ci_updated_date date
);


ALTER TABLE public.tbl_cities OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_comment_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_comment; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE TABLE public.tbl_comment (
    cmt_id integer DEFAULT nextval('public.tbl_comment_id_seq'::regclass) NOT NULL,
    cmt_content text,
    cmt_product_id integer NOT NULL,
    cmt_vote integer,
    cmt_status integer DEFAULT 0,
    cmt_create_date date,
    cmt_update_date date,
    cmt_acc_id integer NOT NULL
);


ALTER TABLE public.tbl_comment OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_delivery_address_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_delivery_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_delivery_address_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_delivery_address; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
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


ALTER TABLE public.tbl_delivery_address OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_districts_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_districts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_districts_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_districts; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE TABLE public.tbl_districts (
    dis_id integer DEFAULT nextval('public.tbl_districts_id_seq'::regclass) NOT NULL,
    dis_name character varying(50),
    dis_city_id integer NOT NULL,
    dis_created_date date,
    dis_updated_date date
);


ALTER TABLE public.tbl_districts OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_product_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_product; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
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
    prod_status integer DEFAULT 0
);


ALTER TABLE public.tbl_product OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_product_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_image_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_product_images; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE TABLE public.tbl_product_images (
    prod_img_id integer DEFAULT nextval('public.tbl_product_image_id_seq'::regclass) NOT NULL,
    prod_img_product_id integer NOT NULL,
    prod_img_data text,
    prod_img_status integer DEFAULT 0
);


ALTER TABLE public.tbl_product_images OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_roles; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE TABLE public.tbl_roles (
    rol_id character varying(5) NOT NULL,
    rol_name character varying(5),
    role_status integer DEFAULT 0,
    rol_create_date date,
    rol_update_date date
);


ALTER TABLE public.tbl_roles OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_wards_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_wards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_wards_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_wards; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
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


ALTER TABLE public.tbl_wards OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_ware_house_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_ware_house_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_ware_house_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_ware_house; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
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


ALTER TABLE public.tbl_ware_house OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_ware_house_id_seq; Type: SEQUENCE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE SEQUENCE public.tbl_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_cart_id_seq OWNER TO pnnyoamvocwgoi;

--
-- Name: tbl_cart; Type: TABLE; Schema: public; Owner: pnnyoamvocwgoi
--

CREATE TABLE public.tbl_cart (
    cart_id integer DEFAULT nextval('public.tbl_cart_id_seq'::regclass) NOT NULL,
    cart_acc_id integer,
    cart_prod_id integer,
    cart_amount integer,
    cart_status integer DEFAULT 0,
    cart_created_date date,
    cart_updated_date date
);


ALTER TABLE public.tbl_ware_house OWNER TO pnnyoamvocwgoi;

--
-- Data for Name: tbl_account; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_account (acc_id, acc_password, acc_token, acc_email, acc_phone_number, acc_full_name, acc_role, acc_avatar, acc_status, acc_created_date, acc_updated_date, acc_token_forgot, acc_refresh_token) FROM stdin;
3	$2b$04$2Nvz5KTonmH7ejSJu5Ln5OLkTk/yjj/k7wGnOwODoIIOcjWUhABtW	$2b$04$Gf57AdqTuSPXW1L4UaDHo.aMIeb.TE5s3XCY2nGiPu.Cf.zPc7zfC	dangtrunghieu2304@gmail.com	8498888835	Dang Trung Hieu	ADM	\N	2	2021-08-04	\N	\N	\N
4	$2b$04$x/ExsxZJ0iIl2OCLGoayKO65HHxJ9re9dRPDx5R3z.EfoYvj8sVmu	$2b$04$Q1nd3CqvcIlUs2zuAuAiu.T/ENBenMGek.ReMwZdeEd7iIB4ryRZK	dangtrunghieu17ck1@gmail.com	8445454545	dang trung hieu 	ADM	\N	2	2021-08-04	\N	\N	\N
5	$2b$04$MRUhUtyU8Eo13GGSzV3npeWbkp7DwDfgeR5MQ4kujzraaD0HHC6uq	$2b$04$swUJpczM7fXS4DihxsoULeohGrGrmhYsBkTX.iTYaV5GJ96KYxXne	test123@gmail.com	2131231234	asdasdasd	ADM	\N	2	2021-08-04	\N	\N	\N
6	$2b$04$WLbEtoLVLGQHaY6ZAYv.JeSqlJHtwWBSxSmE9kByY0tVeOJylkfbS	$2b$04$6.OGLwJh9DbuIa8hs5CgUegL.gC6pLCXGQlMnFRz22ti2LsUN3e2K	asd@gmail.com	84121231233	khalasdas	ADM	\N	2	2021-08-04	\N	\N	\N
7	$2b$04$UHnTPmdbJ4OSvPxh/f5hy.AOHj7pX.n5vq/izx4OlyfKFkSn6BLhy	$2b$04$PLXEFhMytznIICkeNY/H5u8gqaVHZ6FIs8n9v5xgCuobzITNKOxya	khong@gmail.com	08887727272	asdasdas	ADM	\N	2	2021-08-04	\N	\N	\N
8	$2b$04$lDnJcZDseZi3LWtFan0WGeeY6Rj3e6uj80LmKti42RIUrmMB01vXi	$2b$04$vAe0bOsb/SnEr1h7dmsQEeT5kaqiMetWCgCLBJaXF9xn.yPQpLU.q	tem@gmail.com	84019123123	temp	ADM	\N	2	2021-08-04	\N	\N	\N
9	$2b$04$hwLZ4qiaqVw8xj7RtzcL..cLZeLKxihZXuvKNrC6akSBtcBuH80.K	$2b$04$vqBv.QQI2vQsvP1rTtlWbebLeXgBoUZHtgKqHqe57D6SRitSSwFdW	jidawal233@hyprhost.com	4534535454	hieu	ADM	\N	2	2021-08-04	\N	\N	\N
10	$2b$04$6mk2P09xWeMt/kaBDhphnetvI3oCpGExI6c707dFzfGfMn9iymXRC	$2b$04$DqRagIDx3nhfl7Xt/nWnK.fRucrfpLz5KNhPhpkhs1XvG5i3NY9um	gadoyew739@aline9.com	8412123123123	asdasd	ADM	\N	2	2021-08-04	\N	\N	\N
11	$2b$04$CdEEWMoHV5KBtUH/.JX1AOCtikG8XDCJhoYVN95mv87VbHVnlGauS	$2b$04$U73ssgioHYyPdwEafkUvfeTvWAsPVSE5kXB5MF6YN7hNEWgZZTwP2	bawip28482@flipssl.com	840102931231	test	ADM	\N	2	2021-08-04	\N	\N	\N
12	$2b$04$wqDwWl99PYLlicF17nM7uup3oS7DeZpObU3rOxTwjnH9dmtZGmDi6	$2b$04$1Qu3OdXSXqfaFYMMdP.AsOpfoHxEm1ucMhgQU6kWkp9RFaeyTNV3i	cokal62633@aline9.com	84980772222	hieudang	ADM	\N	2	2021-08-05	\N	\N	\N
13	$2b$04$nrCaf6PUf5BjrPYSmtkrDOxPqLBtPhE97zPKizXseF9HjhEmLAA02	$2b$04$sFZz7L644281T7k65ghpY.JlB52S77EsxJe3KzdVPWvmDV0v3z7VK	xacekav692@aline9.com	8412121233	form	ADM	\N	2	2021-08-05	\N	\N	\N
14	$2b$04$XWMdXg/UNI1dr6OtlkNvu.6m3iFIX.VDJ/0tH/F/E/x.xnFta0cSS	\N	rixivas354@aline9.com	84454534534	Test	ADM	\N	0	2021-08-05	2021-08-05	\N	\N
15	$2b$04$Ki.eEHMJrWkKheB9tm1ZluQR/w6Wh3EDq6CuUu.Ej/DkZJMZvKXBy	\N	mesep88169@aline9.com	84223232313	Hong Cho	ADM	\N	0	2021-08-05	2021-08-05	\N	\N
16	$2b$04$nZsmV.CXTYQhTH8KRyQ2PeptZyh3XxtF2n1IJhV4zIcdYy5yYQANS	\N	gatewa5732@flipssl.com	8412312312	Test	ADM	\N	0	2021-08-05	2021-08-05	\N	\N
28	$2b$04$1MmtQbgacGy9BVQkQF4o5.0hIpvmMi0R7Jqij3QqAIXUGKHfh.3zy	\N	fabirim512@100xbit.com	84586072996	Ari Nguyen	USER	\N	0	2021-08-08	2021-08-08	\N	cUuEVXCYMBS6nwkItNiHmWQ7keOpwrgcHuwmpbqT7ZlbWp40CeXJ9ir5clSsNcclrNIeBzg5G9cqgKYnFBGcIEPkLi0KUwNeYzOx
27	$2b$04$G27jvrpmXzPSvfLSIhV00ednPyUJYCESlpIyGfMW4FL9cb/HRfREe	\N	nguyenthedao69@gmail.com	\N	\N	USER	\N	0	2021-08-08	2021-08-08	\N	\N
17	$2b$04$aMMM2h4nqqWsWxLLjh9m6eNj0l9QVTkUsne2zpazcWFSqrUlwN1gm	\N	vijog51651@biohorta.com	84859888905	vijog51651@biohorta.com	ADM	\N	0	2021-08-05	2021-08-05	\N	Frz01qrEwEij9wtlAm5zAyc41KexKZsZHhcbAP4vI8VoYlejePskydnP9U9rRqkWpOaof44crv8186N0rcYn6fXs8BwFxkbHMgCC
29	$2b$04$KIrsvsCIOe8JIWET6wwT6ehlBHR7f3GdiUvTb0kV/.ua.WZKhcZie	\N	ldh89862@eoopy.com	1234567890	ldh89862@eoopy.com	USER	\N	0	2021-08-08	2021-08-08	\N	NAKemkancnHMi0xHm1cAGNzufiuuKVGjRe7zbH1UWPunRUadntLI6xT9lmlWroqAYaO5HbCk2C4ODjK8eHHMBuVdfqsI6exqlz6P
18	$2b$04$fAkkyELf9a./G2jjbKqO.e9u8p9G5hvtpBaSRymPvuT1Mnp9nLbVK	\N	vosithien1234@gmail.com	\N	\N	ADM	\N	0	2021-08-05	2021-08-05	\N	\N
19	$2b$04$iyKjX.kVMu6gjrnuqFXh8eyduwvR1jJwHpoDcCt6IivYnPvd7mObW	$2b$04$23v9RkEBPb4yMSmMIavIse.dxoWksniYIuUe.KRwdyJQVHzfUZKoC	hellovictim113@gmail.com	840859888905	Nguyen Van Nhat	ADM	\N	2	2021-08-05	\N	\N	\N
20	$2b$04$zCsczZSfd53epvtP0N.ezO53ONYHDhKGfLMkvBKmZS4prXvuX78bm	$2b$04$gjJv7SSyzm.VJawYXkuZnucxW0pmXk.vL/7u90jKkmBdgtjAWx1sK	gicibe9619@100xbit.com	8412345678	demo	ADM	\N	2	2021-08-06	\N	\N	\N
21	$2b$04$WeVl79HJUgcJHiSwrfKJAODlDVgrp8HnL1aT0.myY6SCWsLAKCgCK	$2b$04$ccvOygUvbw3YJ..XidYnX.YQNY4QEVqULuTsyHbtYDw8rM.WwVx/e	ukw11965@eoopy.com	84123456789	demo	ADM	\N	2	2021-08-06	\N	\N	\N
22	$2b$04$3W/2hgG2bhGlTFfBhWTlxuPWuExtAhfjyIBjsn8SIwjHSM6fNwLOm	\N	nhatdev.1604@gmail.com	84123456789	nhatdev.1604@gmail.com	ADM	\N	0	2021-08-06	2021-08-06	\N	\N
23	$2b$04$9r61SDnLN0tYRq.MTzPRnulYnDZBfOZ2sjOcZnnv/p/nr4Q2A0h6.	$2b$04$.nH8e8FtYrebHZUcBTMkues2JEonIBGRliNUgsEXHzLC/QW0bp6iK	jxf28754@zwoho.com	\N	\N	USER	\N	2	2021-08-07	\N	\N	\N
24	$2b$04$H/VB4Dr3fVrPpcBIJGlBguIfddDQmmaF/6dFwXAs.XQdayCH1q3vy	$2b$04$GR5KEiOLvDkfniE1QQTJ4ucFKcPC.u8CZWAuBoImCg2RhgG2zKZsa	fxx77114@zwoho.com	\N	\N	USER	\N	2	2021-08-07	\N	\N	\N
25	$2b$04$aU5xTRKnxw1RNnZqW/2HQ.J/bwk7FHblMr0NgG8ZaM84QW8EaXih6	\N	ila93231@cuoly.com	\N	\N	USER	\N	0	2021-08-07	2021-08-07	\N	\N
32	$2b$04$S33Qe7RWwWV2hRt9IwtHqOQOQfeLx36x5Bb1F3luK.BZpYrui4DqK	$2b$04$GHvXnAng4.9xiLsU7d6Y2e2IU.nsQn99zuxutx6Jd1PhgC7ODEYr6	dnl76807@zwoho.com	8411111111	@@	USER	\N	2	2021-08-08	\N	\N	\N
33	$2b$04$FiLBWp.rmHc7REWRnGeFSekaMsO/QHjKE48hE4ljpp6.ouswODdxm	$2b$04$LBWBJjEztgvceDQeEurKYugFmhvpmts.cj7LJZEl7/GUnuaS7iYuu	cuc56453@eoopy.com	8411111111	 @	USER	\N	2	2021-08-08	\N	\N	\N
30	$2b$04$EyGd4UPQri20XxWQzjnM1eSIcVAvwMbAAwA56Pv7wWemSaOwWojni	\N	hiyaco5622@186site.com	84586072996	Ari Test	USER	\N	0	2021-08-08	2021-08-08	\N	\N
26	$2b$04$3RN.vPzEWOhYlTOb6uT2jOgGb7MZ7mwzoJZ7Km2jSS4mIiURHNAeS	\N	ccy00683@zwoho.com	\N	\N	USER	\N	0	2021-08-07	2021-08-07	\N	\N
34	$2b$04$/ilyen07RnNT0y0A6/LvY./dovvJeC7802/4imCy.JLWUlrqA5MAC	$2b$04$wjwH4ojs4sH6pZI3NMkyEuAVYyJxRBN4VgrsmccZl702HcXzwGj7a	jdh22516@zwoho.com	84111111111	jdh22516@zwoho.comjdh22516@zwoho.2512516@zwoho.comjdh22516@zwoho.comjdh22516@zwoho.com	USER	\N	2	2021-08-08	\N	\N	\N
35	$2b$04$je.zbrRMdvoRZHFhm5cR8Ovi23IUq988ihg0lpBzbMqNAsPT00lo.	\N	fdg17060@eoopy.com	8411111111111	fdg17060@eoopy.com	USER	\N	0	2021-08-08	2021-08-08	\N	pDisdTEgOHUeWmb2BCACHaECN0IIfWjkJ2qcksa77aXOVWX2q2h9RnK8jmP5qbmPkqDMPYiL6yNaU3XD5pExFizUIcDpioyutIAm
36	$2b$04$dLhDrWL30wa4Wqynm8j4z.AwrzA124OSJCRZFRTT7OSYMzz7NV1/K	\N	ssv19243@zwoho.com	841111111111	ssv19243@zwoho.com	USER	\N	0	2021-08-08	2021-08-08	\N	erY0n6fv6nSy71yZLwwehSXDv50HRJUDb1T2VDNXsn8AndSQeM6QMgCIM9MK8EVQXI6rqljGWOe9h3Dq1chzzBwFOmEeApGKXp8O
31	$2b$04$QoR.9x24S.WWIT/PNhj60O.V1rmxaK18UthawZQ.s9lLGgZz2MCky	$2b$04$r2yxpn0RNqkxmUMDO3dDU.J4AbARZ0xi6vjdP530m.9Jnj2bOmxnK	hicosap661@186site.com	84586072996	Ari Test Không Xác Thực Test Xong Xóa Dùm Nha Cảm Ơn	USER	\N	2	2021-08-08	\N	\N	jJXDR3xdbEUHw5eIzSKBxWPuU6JIAncLFjrj6NcWQIOBQvmxChugitWWvmvd4AuSmPC6JM2myI0nmJ1DODAjRurfyFBvXoLiVxEC
37	$2b$04$g3mp5v.p/8iDn.LZE.VxU.zjUJvyRw0SzPFykWzHwfc.OQaodSOy.	$2b$04$Kn9OP/zbTvGhP2Yy7mR8ce21IXNPt37bfMlRh0duQDjcZjLx.0M4W	fee42886@cuoly.com	84123456789	fee42886@cuoly.com	USER	\N	2	2021-08-08	2021-08-08	\N	IYkZvHGFbTKiTvZdhAYLNncc91ZBdkhyWIPtUfOr9BycW0jK25cXakocNrsfxvVh6cqU1WUhIbQUNK2xI9N5PDI7BxY1AnQtl0HG
38	$2b$04$skUdhPN9RhDYbTvWZJCrpeSpX3H6xMA5BuTJ5NCiEkfgX4KnCYmXu	$2b$04$.DqujUk8ai/v9MteAEsqu./uleiwpcPFgVKxhqv.OK1QPnBEJ5ibm	sju73859@zwoho.com	8413456978	sju73859@zwoho.com	USER	\N	2	2021-08-08	\N	\N	fmdJDI2gi6qEr20FvG1Uau94RUIueXBSy5e1PMH8LTMU67CsOArzsys2yGNVudB30TpiyZCrao1LcTwWIJiiFEDoik3N9IbKF4yT
39	$2b$04$y/ZDuuf6KrgpVkYcBgwSWONshyV7IqtbmuG2dxZnKe6L3sEMupksq	\N	vho23272@cuoly.com	8412346589	vho23272@cuoly.com	USER	\N	0	2021-08-08	2021-08-08	$2b$04$pnUHeOe2g6zxexvkNgPztupjTqDHy4dl9JL9Y2PvZYqvKFdeDyGdS	UetOJB709OPeVhGEvxVniXFLLdw8wXnUlteIsaab5ARZjPE67TnUTxureJIsnd6J4GjzCSm6hbfVLuSmr9nyYVZVJyGzBPw6HcHz
2	$2b$04$BAaV2SDvid3kCWxYwnRSwuRdzV5aANU3wMCo4O2dsUiS5gHNgiB5i	\N	nthedao2705@gmail.com	\N	\N	ADM	\N	0	2021-08-03	2021-08-09	\N	FT08eU2s4wvqSizhWzR1WNamWdZEJNHapEFBi0ITJJV3OTxwj0FZjHrWddl0ula1AO3w0FoWBO18NgPhl5pLcn7cInCdyg2gUMvT
40	$2b$04$LgpnKpIeNbSZq06mG.p9deLPN9/fyHQ1oMy68ihYSsVqhSO.K0PKW	\N	yiyiw94212@cfcjy.com	84586072996	Test 18/8/20218	USER	\N	0	2021-08-18	2021-08-18	\N	xLNnnWMfaHL7pI5t8avZCCQm2KVgdF3bq9FzEIRjf4GLOKMlTgw9HUMgYupqNwPKeSzUyPwpd2nyT8yDLN88gsx7UJ2dXytm7R8Q
\.


--
-- Data for Name: tbl_bill; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_bill (bill_id, bill_account_id, bill_total_price, bill_total_quantity, bill_status, bill_created_date, bill_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_bill_detail; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_bill_detail (bdetail_id, bdetail_bill_id, bdetail_product_id, bdetail_quantity, bdetail_product_price, bdetail_status, bdetail_created_date, bdetail_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_categories; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_categories (cate_id, cate_name, cate_status, cate_father, cate_created_date, cate_updated_date) FROM stdin;
3	Category 3	0	\N	2001-01-01	2001-01-01
83	12321	0	\N	2021-08-18	2021-08-18
6	cate_6	0	2	2021-08-15	2021-08-15
7	cate_7	0	2	2021-08-15	2021-08-15
8	cate_8	0	3	2021-08-15	2021-08-15
84	333	0	\N	2021-08-18	2021-08-18
85	32	0	\N	2021-08-18	2021-08-18
9	cate_10	0	3	2021-08-15	2021-08-16
91	123456789	0	1	2021-08-18	2021-08-18
92	1234567891	0	1	2021-08-18	2021-08-18
14	Thức uống	0	\N	2021-08-17	2021-08-17
96	1231	0	1	2021-08-18	2021-08-18
18	Category 4	0	\N	2021-08-17	2021-08-17
97	demo	0	1	2021-08-18	2021-08-18
98	asdasdsa	0	1	2021-08-18	2021-08-18
99	asdsadsa	0	1	2021-08-18	2021-08-18
95	cake	0	2	2021-08-18	2021-08-18
19	Category 54	0	\N	2021-08-17	2021-08-18
56	Cate Tuan Anh	0	\N	2021-08-17	2021-08-18
103	234234234234	0	\N	2021-08-18	2021-08-18
70	144	0	1	2021-08-17	2021-08-18
57	Tuấn Anh con 11	0	56	2021-08-17	2021-08-18
104	danh mục 14	0	\N	2021-08-18	2021-08-18
43	cherry	0	2	2021-08-17	2021-08-17
45	avocado	0	2	2021-08-17	2021-08-17
4	avocado	0	2	2021-08-15	2021-08-17
49	cherry	0	1	2021-08-17	2021-08-17
58	Tuấn Anh Nhỏ	0	56	2021-08-17	2021-08-17
59	1	0	56	2021-08-17	2021-08-17
60	2	0	56	2021-08-17	2021-08-17
61	3	0	56	2021-08-17	2021-08-17
62	4	0	56	2021-08-17	2021-08-17
63	5	0	56	2021-08-17	2021-08-17
64	6	0	56	2021-08-17	2021-08-17
65	7	0	56	2021-08-17	2021-08-17
66	8	0	56	2021-08-17	2021-08-17
67	9	0	56	2021-08-17	2021-08-17
68	12	0	56	2021-08-17	2021-08-17
69	11	0	56	2021-08-17	2021-08-17
78	Tuấn Anh nè 	0	56	2021-08-17	2021-08-17
2	Category 2	0	\N	2001-01-01	2021-08-17
1	Dương đào@	0	\N	2001-01-01	2021-08-17
\.


--
-- Data for Name: tbl_cities; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_cities (ci_id, ci_name, ci_created_date, ci_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_comment; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_comment (cmt_id, cmt_content, cmt_product_id, cmt_vote, cmt_status, cmt_create_date, cmt_update_date, cmt_acc_id) FROM stdin;
\.


--
-- Data for Name: tbl_delivery_address; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_delivery_address (del_id, del_detail_address, del_district_id, del_city_id, del_user_id, del_status, del_ward_id) FROM stdin;
\.


--
-- Data for Name: tbl_districts; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_districts (dis_id, dis_name, dis_city_id, dis_created_date, dis_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_product; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_product (prod_id, prod_name, prod_category_id, prod_amount, prod_created_date, prod_updated_date, prod_price, prod_description, prod_status) FROM stdin;
28	test	4	3000	2021-08-17	2021-08-17	123	test test	1
33	demohihi	49	123	2021-08-17	\N	123	12312	1
38	2	58	2	2021-08-18	\N	2	2	1
39	3	61	3	2021-08-18	\N	3	3	1
40	44	8	4	2021-08-18	2021-08-18	4	4	1
\.


--
-- Data for Name: tbl_product_images; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_product_images (prod_img_id, prod_img_product_id, prod_img_data, prod_img_status) FROM stdin;
156	38	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1629249399/skvmha5zqkerpjvysazc.jpg	0
157	39	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1629249511/hck0nqydizo0ug787tlp.jpg	0
158	40	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1629249562/rbb1xfc8e45miey4l7xa.jpg	0
161	28	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1629264000/ylsihu4ceupkxfscqskq.jpg	0
162	28	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1629264000/vl9l1puvybkyeujynw96.jpg	0
163	28	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1629264000/mykszd3dczxvxllh8rg1.jpg	0
149	33	http://res.cloudinary.com/gvlt-qlqtpm/image/upload/v1629222095/w22sowkjcb4ifsqoscsy.jpg	0
\.


--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_roles (rol_id, rol_name, role_status, rol_create_date, rol_update_date) FROM stdin;
ADM	admin	0	2021-07-25	2021-07-25
USER	user	0	2021-08-05	2021-08-05
\.


--
-- Data for Name: tbl_wards; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_wards (ward_id, ward_name, ward_city_id, ward_dis_id, ward_created_date, ward_updated_date, ward_ship_price) FROM stdin;
\.


--
-- Data for Name: tbl_ware_house; Type: TABLE DATA; Schema: public; Owner: pnnyoamvocwgoi
--

COPY public.tbl_ware_house (sto_id, sto_account_id, sto_product_name, sto_amount, sto_category_id, sto_origin_price, sto_created_date, sto_updated_date, sto_product_id, cost, sto_status) FROM stdin;
\.


--
-- Name: tbl_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_account_id_seq', 40, true);


--
-- Name: tbl_bill_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_bill_detail_id_seq', 1, false);


--
-- Name: tbl_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_bill_id_seq', 2, true);


--
-- Name: tbl_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_categories_id_seq', 104, true);


--
-- Name: tbl_cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_cities_id_seq', 1, false);


--
-- Name: tbl_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_comment_id_seq', 1, false);


--
-- Name: tbl_delivery_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_delivery_address_id_seq', 1, false);


--
-- Name: tbl_districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_districts_id_seq', 1, false);


--
-- Name: tbl_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_product_id_seq', 42, true);


--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_product_image_id_seq', 163, true);


--
-- Name: tbl_wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_wards_id_seq', 1, false);


--
-- Name: tbl_ware_house_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_ware_house_id_seq', 1, false);


--
-- Name: tbl_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pnnyoamvocwgoi
--

SELECT pg_catalog.setval('public.tbl_cart_id_seq', 1, false);


--
-- Name: tbl_account tbl_account_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_pkey PRIMARY KEY (acc_id);


--
-- Name: tbl_bill_detail tbl_bill_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_bill_detail
    ADD CONSTRAINT tbl_bill_detail_pkey PRIMARY KEY (bdetail_id);


--
-- Name: tbl_bill tbl_bill_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_bill
    ADD CONSTRAINT tbl_bill_pkey PRIMARY KEY (bill_id);


--
-- Name: tbl_categories tbl_categiries_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categiries_pkey PRIMARY KEY (cate_id);


--
-- Name: tbl_cities tbl_cities_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_cities
    ADD CONSTRAINT tbl_cities_pkey PRIMARY KEY (ci_id);


--
-- Name: tbl_comment tbl_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_comment_pkey PRIMARY KEY (cmt_id, cmt_product_id);


--
-- Name: tbl_delivery_address tbl_delivery_address_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_delivery_address_pkey PRIMARY KEY (del_id);


--
-- Name: tbl_districts tbl_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_districts
    ADD CONSTRAINT tbl_districts_pkey PRIMARY KEY (dis_id, dis_city_id);


--
-- Name: tbl_product_images tbl_product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_product_images_pkey PRIMARY KEY (prod_img_id, prod_img_product_id);


--
-- Name: tbl_product tbl_product_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_pkey PRIMARY KEY (prod_id);


--
-- Name: tbl_roles tbl_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_roles
    ADD CONSTRAINT tbl_roles_pkey PRIMARY KEY (rol_id);


--
-- Name: tbl_wards tbl_wards_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_wards
    ADD CONSTRAINT tbl_wards_pkey PRIMARY KEY (ward_id, ward_city_id, ward_dis_id);


--
-- Name: tbl_ware_house tbl_ware_house_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_pkey PRIMARY KEY (sto_id);


--
-- Name: tbl_cart tbl_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_cart
    ADD CONSTRAINT tbl_cart_pkey PRIMARY KEY (cart_id);


--
-- Name: tbl_account tbl_account_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_roles_fkey FOREIGN KEY (acc_role) REFERENCES public.tbl_roles(rol_id);


--
-- Name: tbl_bill_detail tbl_bill_detal_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_bill_detail
    ADD CONSTRAINT tbl_bill_detal_bill_id_fkey FOREIGN KEY (bdetail_bill_id) REFERENCES public.tbl_bill(bill_id);


--
-- Name: tbl_comment tbl_cmt_acc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_acc_id_fkey FOREIGN KEY (cmt_acc_id) REFERENCES public.tbl_account(acc_id) NOT VALID;


--
-- Name: tbl_comment tbl_cmt_prod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_prod_fkey FOREIGN KEY (cmt_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_delivery_address tbl_del_acc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_del_acc_fkey FOREIGN KEY (del_user_id) REFERENCES public.tbl_account(acc_id);


--
-- Name: tbl_delivery_address tbl_del_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_del_district_id_fkey FOREIGN KEY (del_ward_id, del_district_id, del_city_id) REFERENCES public.tbl_wards(ward_id, ward_dis_id, ward_city_id) NOT VALID;


--
-- Name: tbl_districts tbl_districts_cities_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_districts
    ADD CONSTRAINT tbl_districts_cities_fkey FOREIGN KEY (dis_city_id) REFERENCES public.tbl_cities(ci_id);


--
-- Name: tbl_product_images tbl_prod_img_prod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_prod_img_prod_fkey FOREIGN KEY (prod_img_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_product tbl_product_categories_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_categories_fkey FOREIGN KEY (prod_category_id) REFERENCES public.tbl_categories(cate_id);


--
-- Name: tbl_wards tbl_ward_dis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_wards
    ADD CONSTRAINT tbl_ward_dis_id_fkey FOREIGN KEY (ward_dis_id, ward_city_id) REFERENCES public.tbl_districts(dis_id, dis_city_id);


--
-- Name: tbl_ware_house tbl_ware_house_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_account_fkey FOREIGN KEY (sto_account_id) REFERENCES public.tbl_account(acc_id);


--
-- Name: tbl_ware_house tbl_ware_house_categories_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_categories_fkey FOREIGN KEY (sto_category_id) REFERENCES public.tbl_categories(cate_id);


--
-- Name: tbl_ware_house tbl_ware_house_product_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_ware_house
    ADD CONSTRAINT tbl_ware_house_product_fkey FOREIGN KEY (sto_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_cart tbl_cart_product_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pnnyoamvocwgoi
--

ALTER TABLE ONLY public.tbl_cart
    ADD CONSTRAINT tbl_cart_product_fkey FOREIGN KEY (cart_prod_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pnnyoamvocwgoi
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO pnnyoamvocwgoi;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO pnnyoamvocwgoi;


--
-- PostgreSQL database dump complete
--

