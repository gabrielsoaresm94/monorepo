// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
// } from 'typeorm';
// import { Exclude } from 'class-transformer';
// import Audio from '~/modules/audios/shared/typeorm/entities/audio.entity';
// import Documento from '~/modules/documentos/shared/typeorm/entities/documento.entity';
// import Pagina from '~/modules/documentos/shared/typeorm/entities/pagina.entity';

// @Entity('usuarios')
// class Usuario {
//     @PrimaryGeneratedColumn('uuid')
//     usuario_id: string;

//     @Column()
//     nome: string;

//     @Column()
//     email: string;

//     @Column()
//     @Exclude()
//     senha: string;

//     @Column()
//     papel: string;

//     @CreateDateColumn()
//     created_at: Date;

//     @UpdateDateColumn()
//     modified_at: Date;

//     @OneToMany(
//         () => Documento,
//         documento => documento.usuario,
//     )
//     documentos: Documento[];

//     @OneToMany(
//         () => Pagina,
//         pagina => pagina.usuario,
//     )
//     paginas: Pagina[];

//     @OneToMany(
//         () => Audio,
//         audio => audio.usuario,
//     )
//     audios: Audio[];
// }

// export default Usuario;
