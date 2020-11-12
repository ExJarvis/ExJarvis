import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Item {
  @PrimaryColumn('bigint')
  // @Column('binary')
  id: number | undefined;

  @Column('text', { nullable: true })
  name: string | undefined;

  @Column('text', { nullable: true })
  fame: string | undefined;
}