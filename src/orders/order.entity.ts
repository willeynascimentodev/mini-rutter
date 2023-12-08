// order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany  } from 'typeorm';
import { LineItem } from './line-item.entity';
@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plataform_id: string;

  @OneToMany(() => LineItem, (lineItem) => lineItem.orders, { cascade: true })
  line_items: any;

}