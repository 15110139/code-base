import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("people")
export class PeopleEntity extends BaseEntity {
	@Column("char")
	public name!: string;

	@Column("timestamptz")
	public birth_day!: Date;

	@Column("varchar")
	public house_id!: string;
}
