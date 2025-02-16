import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { ClientEntity } from './client.entity';
import { MessageEntity } from './message.entity';
import { StatusConversation } from '../enum/status.conversation.enum';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  idconversation: number;

  @Column({ type: 'varchar', length: 250, nullable: false })
  tema: string;

  //@CreateDateColumn()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  //@CreateDateColumn()
  @Column({ type: 'timestamp', nullable: true })
  closed_at: Date;

  @Column({ type: 'tinyint', width: 1, unsigned: true, default: 0 })
  isactiva: number;

  @Column({
    type: 'enum',
    enum: StatusConversation,
    default: StatusConversation.ABIERTA,
  })
  estatus: StatusConversation;    

  @ManyToOne(() => ClientEntity, client => client.conversations)
  client: ClientEntity;

  // @ManyToOne(() => EmployeeEntity, EmployeeEntity => EmployeeEntity.conversations)
  // @JoinTable()
  // empolyees: EmployeeEntity[];

  @OneToMany(() => MessageEntity, message => message.conversation)
  messages: MessageEntity[];
}
