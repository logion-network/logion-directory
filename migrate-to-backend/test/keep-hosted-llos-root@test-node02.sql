DELETE FROM legal_officer WHERE (1=1
	AND address <> '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' -- Bob
	AND address <> '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y' -- Charlie
);
SELECT address, first_name
FROM legal_officer ;
