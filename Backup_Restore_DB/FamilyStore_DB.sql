--
-- PostgreSQL database dump
--

-- Dumped from database version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

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
-- Name: tbl_bill_detail; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.tbl_bill_detail OWNER TO postgres;

--
-- Name: tbl_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_categories_id_seq
    START WITH 10
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_categories_id_seq OWNER TO postgres;

--
-- Name: tbl_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_categories (
    cate_id integer DEFAULT nextval('public.tbl_categories_id_seq'::regclass) NOT NULL,
    cate_name character varying(100),
    cate_status integer DEFAULT 0,
    cate_father integer,
    cate_created_date date,
    cate_updated_date date
);


ALTER TABLE public.tbl_categories OWNER TO postgres;

--
-- Name: tbl_cities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_cities_id_seq OWNER TO postgres;

--
-- Name: tbl_cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_cities (
    ci_id integer DEFAULT nextval('public.tbl_cities_id_seq'::regclass) NOT NULL,
    ci_name character varying(50),
    ci_created_date date,
    ci_updated_date date
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
    cmt_status integer DEFAULT 0,
    cmt_create_date date,
    cmt_update_date date,
    cmt_acc_id integer NOT NULL
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
    del_district_id integer,
    del_city_id integer,
    del_user_id integer,
    del_status integer DEFAULT 0,
    del_ward_id integer
);


ALTER TABLE public.tbl_delivery_address OWNER TO postgres;

--
-- Name: tbl_districts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_districts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_districts_id_seq OWNER TO postgres;

--
-- Name: tbl_districts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_districts (
    dis_id integer DEFAULT nextval('public.tbl_districts_id_seq'::regclass) NOT NULL,
    dis_name character varying(50),
    dis_city_id integer NOT NULL,
    dis_created_date date,
    dis_updated_date date
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
    prod_category_id integer,
    prod_amount integer,
    prod_created_date date,
    prod_updated_date date,
    prod_price character varying(100),
    prod_description character varying(1000),
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
-- Name: tbl_wards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_wards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_wards_id_seq OWNER TO postgres;

--
-- Name: tbl_wards; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.tbl_wards OWNER TO postgres;

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
    sto_category_id integer,
    sto_origin_price character varying(100),
    sto_created_date date,
    sto_updated_date date,
    sto_product_id integer,
    cost character varying(100),
    sto_status integer DEFAULT 0
);


ALTER TABLE public.tbl_ware_house OWNER TO postgres;

--
-- Data for Name: tbl_account; Type: TABLE DATA; Schema: public; Owner: postgres
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
2	$2b$04$BAaV2SDvid3kCWxYwnRSwuRdzV5aANU3wMCo4O2dsUiS5gHNgiB5i	\N	nthedao2705@gmail.com	\N	\N	ADM	\N	0	2021-08-03	2021-08-09	\N	uTFWNxL7eineUO10toEwpXmfGtnU0xC6IuyljHUKf1xgtnisi6x5MLk1EJTuC6i4Y9P0c0nGzbieF4rdiGW2Hi3VY8lAo7qprpvf
\.


--
-- Data for Name: tbl_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_categories (cate_id, cate_name, cate_status, cate_father, cate_created_date, cate_updated_date) FROM stdin;
1	Category 1	0	\N	2001-01-01	2001-01-01
2	Category 2	0	\N	2001-01-01	2001-01-01
3	Category 3	0	\N	2001-01-01	2001-01-01
4	cate_4	0	1	2021-08-15	2021-08-15
5	cate_5	0	1	2021-08-15	2021-08-15
6	cate_6	0	2	2021-08-15	2021-08-15
7	cate_7	0	2	2021-08-15	2021-08-15
8	cate_8	0	3	2021-08-15	2021-08-15
9	cate_9	0	3	2021-08-15	2021-08-15
\.


--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_roles (rol_id, rol_name, role_status, rol_create_date, rol_update_date) FROM stdin;
ADM	admin	0	2021-07-25	2021-07-25
USER	user	0	2021-08-05	2021-08-05
\.


--
-- Name: tbl_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_account_id_seq', 39, true);


--
-- Name: tbl_bill_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_bill_detail_id_seq', 1, false);


--
-- Name: tbl_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_bill_id_seq', 2, true);


--
-- Name: tbl_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_categories_id_seq', 1, true);


--
-- Name: tbl_cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_cities_id_seq', 1, false);


--
-- Name: tbl_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_comment_id_seq', 1, false);


--
-- Name: tbl_delivery_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_delivery_address_id_seq', 1, false);


--
-- Name: tbl_districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_districts_id_seq', 1, false);


--
-- Name: tbl_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_id_seq', 3, true);


--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_image_id_seq', 10, true);


--
-- Name: tbl_wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_wards_id_seq', 1, false);


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
    ADD CONSTRAINT tbl_districts_pkey PRIMARY KEY (dis_id, dis_city_id);


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
-- Name: tbl_wards tbl_wards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_wards
    ADD CONSTRAINT tbl_wards_pkey PRIMARY KEY (ward_id, ward_city_id, ward_dis_id);


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
-- Name: tbl_comment tbl_cmt_acc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_acc_id_fkey FOREIGN KEY (cmt_acc_id) REFERENCES public.tbl_account(acc_id) NOT VALID;


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
-- Name: tbl_delivery_address tbl_del_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_delivery_address
    ADD CONSTRAINT tbl_del_district_id_fkey FOREIGN KEY (del_ward_id, del_district_id, del_city_id) REFERENCES public.tbl_wards(ward_id, ward_dis_id, ward_city_id) NOT VALID;


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
-- Name: tbl_wards tbl_ward_dis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_wards
    ADD CONSTRAINT tbl_ward_dis_id_fkey FOREIGN KEY (ward_dis_id, ward_city_id) REFERENCES public.tbl_districts(dis_id, dis_city_id);


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

