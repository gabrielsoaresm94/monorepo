// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     ManyToOne,
//     JoinColumn,
//     OneToMany,
// } from 'typeorm';
// import Usuario from '~/modules/usuarios/shared/typeorm/entities/usuario.entity';
// import Pagina from './pagina.entity';

// @Entity('documentos')
// class Documento {
//     @PrimaryGeneratedColumn('uuid')
//     documento_id: string;

//     @Column()
//     nome: string;

//     @Column()
//     descricao: string | null;

//     @Column()
//     assunto: string | null;

//     @Column()
//     qtd_imagens: number;

//     @CreateDateColumn()
//     created_at: Date;

//     @UpdateDateColumn()
//     modified_at: Date;

//     @Column()
//     usuario_id: string;

//     @OneToMany(
//         () => Pagina,
//         pagina => pagina.usuario,
//     )
//     paginas: Pagina[];

//     @ManyToOne(
//         () => Usuario,
//         usuario => usuario.documentos,
//     )
//     @JoinColumn({ name: 'usuario_id' })
//     usuario: Usuario;
// }

// export default Documento;
