import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Item
{
  @PrimaryColumn('bigint')
  // @Column('binary')
	id: number;

	@Column('text')
	name: string;
}