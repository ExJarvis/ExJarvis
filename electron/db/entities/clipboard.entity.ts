import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Clipboard {
  @PrimaryGeneratedColumn()
	id?: string;

  @Column({ type: 'simple-json', nullable: true })
  data: any | undefined;
}