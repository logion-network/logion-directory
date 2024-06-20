DELETE FROM legal_officer WHERE (1=1
	AND address <> '5GYirZEq8byGJePM9FM3JQG8Zwc5B6AcNpqgbrFvGRw2VQKE' -- Sylvian
	AND address <> '5Hox4L7Ek1CrXwbYzH8v64WvXkp6rQRkgxuhqE3i2c3farQ9' -- Rui
);
SELECT address, first_name
FROM legal_officer ;
