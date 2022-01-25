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
        details: "MODERO\nHuissier de Justice Etterbeek\nRue Beckers 17\n1040 Etterbeek\nBelgique",
        node: "http://localhost:8080"
    },
    {
        address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        userIdentity: {
            firstName: "Guillaume",
            lastName: "Grain",
            email: "g.grain@adrastee-lyon.fr",
            phoneNumber: "+33 4 78 52 87 56",
        },
        details: "SELARL ADRASTEE\nGare des Brotteaux\n14, place Jules Ferry\n69006 LYON\nFrance",
        node: "http://localhost:8081"
    },
    {
        address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
        userIdentity: {
            firstName: "Alain",
            lastName: "Barland",
            email: "alain.barland@auxilia-conseils.com",
            phoneNumber: "+33 2 48 67 50 50",
        },
        details: "AUXILIA CONSEILS 18\nHuissiers de Justice associés\n7 rue Jean Francois Champollion Parc Comitec\n18000 Bourges\nFrance",
        node: "http://localhost:8082"
    }
]
