import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("street")
export class StreetEntity extends BaseEntity {
	@Column("varchar")
	public street_id!: string;

	@Column("varchar")
	public name!: string;
}
