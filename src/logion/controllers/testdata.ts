import { components } from "./components";

type LegalOfficerView = components["schemas"]["LegalOfficerView"]

export const LEGAL_OFFICERS: LegalOfficerView[] = [
    {
        address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        userIdentity: {
            firstName: "Patrick",
            lastName: "Gielen",
            email: "patrick@logion.network",
            phoneNumber: "+32 498 237 107",
        },
        postalAddress: {
            company: "MODERO",
            line1: "Huissier de Justice Etterbeek",
            line2: "Rue Beckers 17",
            postalCode: "1040",
            city: "Etterbeek",
            country: "Belgique"
        },
        node: "http://localhost:8080",
    },
    {
        address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        userIdentity: {
            firstName: "Guillaume",
            lastName: "Grain",
            email: "g.grain@adrastee-lyon.fr",
            phoneNumber: "+33 4 78 52 87 56",
        },
        postalAddress: {
            company: "SELARL ADRASTEE",
            line1: "Gare des Brotteaux",
            line2: "14, place Jules Ferry",
            postalCode: "69006",
            city: "Lyon",
            country: "France"
        },
        node: "http://localhost:8081",
    },
    {
        address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
        userIdentity: {
            firstName: "Alain",
            lastName: "Barland",
            email: "alain.barland@auxilia-conseils.com",
            phoneNumber: "+33 2 48 67 50 50",
        },
        postalAddress: {
            company: "AUXILIA CONSEILS 18",
            line1: "Huissiers de Justice associés",
            line2: "7 rue Jean Francois Champollion Parc Comitec",
            postalCode: "18000",
            city: "Bourges",
            country: "France"
        },
        node: "http://localhost:8082",
    },
    {
        address: "5FmqTpGanDBVHedXf42fiuWD8d2iBa2Ve8EfG13juifnpgat",
        userIdentity: {
            firstName: "Eline",
            lastName: "Duysens",
            email: "e.duysens@chartierpartners.be",
            phoneNumber: "+32 82 22 50 50"

        },
        postalAddress: {
            line1: "Rue du Calvaire, 1/A",
            postalCode: "5620",
            city: "FLORENNES",
            country: "Belgique"
        },
        additionalDetails: "CHARTIER & PARTNERS\nSiège administratif :\nzoning de la voie cuivrée, 34\n5503 Sorinnes (Dinant)\nBelgique\nEmail: info@chartierpartners.be",
        node: "http://localhost:8082"
    },
    {
        address: "5GYirZEq8byGJePM9FM3JQG8Zwc5B6AcNpqgbrFvGRw2VQKE",
        userIdentity: {
            firstName: "Sylvian",
            lastName: "Dorol",
            email: "s.dorol@venezia-huissiers.com",
            phoneNumber: "+ 33 1 46 24 15 21",
        },
        postalAddress: {
            company: "Venezia & Associés",
            line1: "130 avenue Charles de Gaulle",
            postalCode: "92200",
            city: "Neuilly sur seine",
            country: "France"
        }
    }
]
