--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 12.9 (Debian 12.9-1.pgdg110+1)

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
-- Data for Name: legal_officer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.legal_officer (address, first_name, last_name, email, phone_number, company, line1, line2, postal_code, city, country, additional_details) VALUES ('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 'Alice', 'Logion', 'alice@logion.network', '+1234', '', '', '', '', '', '', '');
INSERT INTO public.legal_officer (address, first_name, last_name, email, phone_number, company, line1, line2, postal_code, city, country, additional_details) VALUES ('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 'Bob', 'Logion', 'bob@logion.network', '+1234', '', '', '', '', '', '', '');
INSERT INTO public.legal_officer (address, first_name, last_name, email, phone_number, company, line1, line2, postal_code, city, country, additional_details) VALUES ('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y', 'Charlie', 'Logion', 'charlie@logion.network', '+1234', '', '', '', '', '', '', '');


--
-- PostgreSQL database dump complete
--

