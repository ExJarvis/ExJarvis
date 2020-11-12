import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
	id?: string;

  @Column({ type: 'simple-json', nullable: true })
  data: string | undefined;
}