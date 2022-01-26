import { Entity, Column, PrimaryColumn, getRepository, Repository } from "typeorm";
import { injectable } from "inversify";

@Entity("legal_officer")
export class LegalOfficerAggregateRoot {

    @PrimaryColumn()
    address?: string;

    @Column({ length: 255, name: "first_name" })
    firstName?: string;

    @Column({ length: 255, name: "last_name" })
    lastName?: string;

    @Column({ length: 255 })
    email?: string;

    @Column({ length: 255, name: "phone_number" })
    phoneNumber?: string;

    @Column({ length: 255, nullable: true })
    company?: string;

    @Column({ length: 255 })
    line1?: string;

    @Column({ length: 255, nullable: true })
    line2?: string;

    @Column({ length: 255, name: "postal_code" })
    postalCode?: string;

    @Column({ length: 255 })
    city?: string;

    @Column({ length: 255 })
    country?: string;

    @Column({ length: 255, name: "additional_details", nullable: true })
    additionalDetails?: string;

    @Column({ length: 255 })
    node?: string;

    getDescription(): LegalOfficerDescription {
        return {
            address: this.address || "",
            userIdentity: {
                firstName: this.firstName || "",
                lastName: this.lastName || "",
                email: this.email || "",
                phoneNumber: this.phoneNumber || "",
            },
            postalAddress: {
                company: this.company || "",
                line1: this.line1 || "",
                line2: this.line2 || "",
                postalCode: this.postalCode || "",
                city: this.city || "",
                country: this.country || "",
            },
            additionalDetails: this.additionalDetails || "",
            node: this.node || ""
        }
    }
}

export interface LegalOfficerDescription {
    readonly address: string
    readonly userIdentity: UserIdentity
    readonly postalAddress: PostalAddress
    readonly additionalDetails: string
    readonly node: string
}

export interface UserIdentity {
    readonly firstName: string
    readonly lastName: string
    readonly email: string
    readonly phoneNumber: string
}

export interface PostalAddress {
    readonly company: string
    readonly line1: string
    readonly line2: string
    readonly postalCode: string
    readonly city: string
    readonly country: string
}

@injectable()
export class LegalOfficerRepository {

    constructor() {
        this.repository = getRepository(LegalOfficerAggregateRoot);
    }

    readonly repository: Repository<LegalOfficerAggregateRoot>

    public findByAddress(address: string): Promise<LegalOfficerAggregateRoot | undefined> {
        return this.repository.findOne(address);
    }

    public findAll(): Promise<LegalOfficerAggregateRoot []> {
        return this.repository.find();
    }
}
