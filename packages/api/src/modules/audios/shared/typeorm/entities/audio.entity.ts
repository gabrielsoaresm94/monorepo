import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import Usuario from 'src/modules/usuarios/shared/typeorm/entities/usuario.entity';

@Entity('audios')
class Audio {
    @PrimaryGeneratedColumn('uuid')
    audio_id: string;

    @Column()
    nome: string;

    @Column()
    tamanho: string | null;

    @Column()
    formato: string;

    @Column()
    assunto: string | null;

    @Column()
    descricao: string | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    modified_at: Date;

    @Column()
    usuario_id: string;

    @ManyToOne(
        () => Usuario,
        usuario => usuario.audios,
    )
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
}

export default Audio;
