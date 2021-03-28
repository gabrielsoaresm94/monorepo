import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Documento from 'src/modules/documentos/shared/typeorm/entities/documento.entity';
import Pagina from 'src/modules/documentos/shared/typeorm/entities/pagina.entity';
import Audio from 'src/modules/audios/shared/typeorm/entities/audio.entity';

@Entity('usuarios')
class Usuario {
    @PrimaryGeneratedColumn('uuid')
    usuario_id: string;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    senha: string;

    @Column()
    papel: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    modified_at: Date;

    @OneToMany(
        () => Documento,
        documento => documento.usuario,
    )
    documentos: Documento[];

    @OneToMany(
        () => Pagina,
        pagina => pagina.usuario,
    )
    paginas: Pagina[];

    @OneToMany(
        () => Audio,
        audio => audio.usuario,
    )
    audios: Audio[];
}

export default Usuario;
