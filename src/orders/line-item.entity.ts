// line-item.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class LineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string | null;

  @ManyToOne(() => Order, (order) => order.line_items)
  order: Order;
}