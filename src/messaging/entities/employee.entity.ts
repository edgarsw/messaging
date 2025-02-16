import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MessageEntity } from "./message.entity";

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  idemployee: number;

  @Column()
  alias: string;

  // @OneToMany(() => ConversationEntity, conversation => conversation.empolyees)
  // @JoinTable()
  // conversations: ConversationEntity[];

  @OneToMany(() => MessageEntity, message => message.employee)
  messages: MessageEntity[];
}