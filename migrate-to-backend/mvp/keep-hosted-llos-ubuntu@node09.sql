DELETE FROM legal_officer WHERE (1=1
	AND address <> '5HGLG8z2jm5KnHeWh2Du8tLLkEVmJ2B6sEnqVsxC2FYjxWRP' -- Romain
	AND address <> '5Gn9QQ6Nnut9qv3yPH2N8ZheaYGaEDQZAiRrdiDq3sBBFPQ2' -- Alain
);
SELECT address, first_name
FROM legal_officer ;
