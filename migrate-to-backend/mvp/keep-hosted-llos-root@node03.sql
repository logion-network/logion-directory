DELETE FROM legal_officer WHERE (1=1
	AND address <> '5FQvrVyaxF6bmQkSKb6Xr9LdiWG4sr3CoyqPQvxJusowisoj' -- Patrick
	AND address <> '5CZy9rGJBsSF9tQ6SkWsjA7kTBiN5ZYJm9zs5ByVPDHCkNHJ' -- François-Michel
	AND address <> '5FmqTpGanDBVHedXf42fiuWD8d2iBa2Ve8EfG13juifnpgat' -- Eline
);
SELECT address, first_name
FROM legal_officer ;
