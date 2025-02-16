import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('client')
export class ClientEntity {
    @PrimaryGeneratedColumn()
    idclient: number;

    @Column({ length: 250, unique: true })
    whatsapp_telefono: string;

    @Column({ length: 250, unique: true })
    mostrar_telefono: string;

    @Column({ type: 'tinyint', width: 1, unsigned: true, default: 1 })
    isSuscrito: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecharegistro: Date;

    //@CreateDateColumn()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechamensaje: Date;

    @Column({ length: 250, nullable: true })
    nombre_cliente: string;

    // @OneToMany(() => MessageEntity, message => message.senderClient)
    // sentMessages: MessageEntity[];

    @OneToMany(() => ConversationEntity, conversation => conversation.client)
    conversations: ConversationEntity[];
}
