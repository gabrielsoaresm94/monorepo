// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     ManyToOne,
//     JoinColumn,
// } from 'typeorm';
// import Usuario from '~/modules/usuarios/shared/typeorm/entities/usuario.entity';
// import Documento from './documento.entity';

// @Entity('paginas')
// class Pagina {
//     @PrimaryGeneratedColumn('uuid')
//     pagina_id: string;

//     @Column()
//     nome: string;

//     @Column()
//     tamanho: string | null;

//     @Column()
//     formato: string;

//     @CreateDateColumn()
//     created_at: Date;

//     @UpdateDateColumn()
//     modified_at: Date;

//     @Column()
//     documento_id: string;

//     @ManyToOne(
//         () => Documento,
//         documento => documento.paginas,
//     )
//     @JoinColumn({ name: 'documento_id' })
//     documento: Documento;

//     @Column()
//     usuario_id: string;

//     @ManyToOne(
//         () => Usuario,
//         usuario => usuario.paginas,
//     )
//     @JoinColumn({ name: 'usuario_id' })
//     usuario: Usuario;
// }

// export default Pagina;
