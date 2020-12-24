import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("house")
export class HouseEntity extends BaseEntity {
	@Column("varchar")
	public house_id!: string;

	@Column("varchar")
    public name!: string;
    
    @Column("varchar")
    public street_id!:string
}
