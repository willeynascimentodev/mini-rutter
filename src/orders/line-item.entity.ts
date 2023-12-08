// line-item.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Orders } from './order.entity';

@Entity()
export class LineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Orders, (order) => order.line_items)
  orders: Orders;
}