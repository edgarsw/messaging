import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { EmployeeEntity } from './employee.entity';
import { TypeSender } from '../constants/constants';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  idmessage: number;

  @Column('text')
  mensaje: string;

  @Column({ type: 'tinyint', width: 1, unsigned: true, default: 0 })
  isleido: number;

  @Column({ type: 'tinyint', width: 1, unsigned: true, default: 0 })
  isrespondido: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column()
  enviadoPor: TypeSender;

  //@CreateDateColumn()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => ConversationEntity, conversation => conversation.messages)
  conversation: ConversationEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.messages, { eager: true, nullable: true })
  employee: EmployeeEntity | null; // Null si el mensaje fue enviado por el cliente.

  // @Column({
  //   type: 'enum',
  //   enum: ['sent', 'delivered', 'read'],
  //   default: 'sent'
  // })
  // status: 'sent' | 'delivered' | 'read';



  // @ManyToOne(() => Message, message => message.replies)
  // reply_to: Message;

  // @OneToMany(() => Message, message => message.reply_to)
  // replies: Message[];

  // @ManyToOne(() => Client, client => client.sentMessages)
  // senderClient: Client;

  // @ManyToOne(() => EmployeeEntity, EmployeeEntity => EmployeeEntity.sentMessages)
  // senderEmployee: EmployeeEntity;
}
