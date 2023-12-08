// order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany  } from 'typeorm';
import { LineItem } from './line-item.entity';
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plataform_id: string;

  @OneToMany(() => LineItem, (lineItem) => lineItem.order, { cascade: true })
  line_items: LineItem[];

}