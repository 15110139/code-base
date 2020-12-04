import {
	BeforeInsert,
	Column,
	PrimaryGeneratedColumn,
} from "typeorm";

export abstract class BaseEntity {
	@PrimaryGeneratedColumn("increment", {
		type: "int",
	})
	public id!: string;

	@Column("timestamptz")
	public create_at?: Date;

	@BeforeInsert()
	protected generateDateBeforeInsert(): void {
		this.create_at = new Date()	
	}
}
