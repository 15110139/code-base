import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("posts")
export class PostEntity extends BaseEntity {
	@Column("varchar")
	public post_id!: string;

	@Column("int8")
	public likes!: number;

	@Column("int8")
	public comments!: number;

	@Column("int8")
	public shares!: number;

	@Column("varchar")
	public description!: string;

	@Column("varchar")
	public call_to_action_url!: string;

	@Column("varchar")
	public image_url!: string;

	@Column("varchar")
	public facebook_account_id!: string;

	@Column("timestamptz")
	public have_seen_at!: Date;

	@Column("varchar")
	public description_url!: string;

	@Column("boolean")
	public is_image!: boolean;

	@Column("boolean")
	public is_video!: boolean;

	@Column("boolean")
	public is_activated!: boolean;

	@Column("int4")
	public genre_id!: string;

	@Column("int8")
	public interaction!: string;

	@Column("varchar")
	public page_name!: string;

	@Column("varchar")
	public page_picture!: string;

	@Column("varchar")
	public page_id!: string;

	@Column("timestamptz")
	public last_seen_at!: Date;

	@Column("varchar")
	public country!: string;

	@Column("int4")
	public ecom_platform_id!: string;

	@Column("varchar")
	public product_class!: string;
}
