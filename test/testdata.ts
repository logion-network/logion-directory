import { LegalOfficerDescription } from "../src/logion/model/legalofficer.model.js";

export const LEGAL_OFFICERS: LegalOfficerDescription[] = [
    {
        address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        userIdentity: {
            firstName: "Alice",
            lastName: "Alice",
            email: "alice@logion.network",
            phoneNumber: "+32 498 00 00 00",
        },
        postalAddress: {
            company: "MODERO",
            line1: "Huissier de Justice Etterbeek",
            line2: "Rue Beckers 17",
            postalCode: "1040",
            city: "Etterbeek",
            country: "Belgique"
        },
        additionalDetails: "",
    },
    {
        address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        userIdentity: {
            firstName: "Bob",
            lastName: "Bob",
            email: "bob@logion.network",
            phoneNumber: "+33 4 00  00 00 00",
        },
        postalAddress: {
            company: "SELARL ADRASTEE",
            line1: "Gare des Brotteaux",
            line2: "14, place Jules Ferry",
            postalCode: "69006",
            city: "Lyon",
            country: "France"
        },
        additionalDetails: "",
    },
    {
        address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
        userIdentity: {
            firstName: "Charlie",
            lastName: "Charlie",
            email: "charlie@logion.network",
            phoneNumber: "+33 2 00 00 00 00",
        },
        postalAddress: {
            company: "AUXILIA CONSEILS 18",
            line1: "Huissiers de Justice associés",
            line2: "7 rue Jean Francois Champollion Parc Comitec",
            postalCode: "18000",
            city: "Bourges",
            country: "France"
        },
        additionalDetails: "",
    }
]
