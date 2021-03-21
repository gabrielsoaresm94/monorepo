import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AdicionarDocumentoIdUsuarioIdParaPaginas1615517411903
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'paginas',
            new TableColumn({
                name: 'documento_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            'paginas',
            new TableForeignKey({
                name: 'PaginaDocumento',
                columnNames: ['documento_id'],
                referencedColumnNames: ['documento_id'],
                referencedTableName: 'documentos',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        await queryRunner.addColumn(
            'paginas',
            new TableColumn({
                name: 'usuario_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            'paginas',
            new TableForeignKey({
                name: 'PaginaUsuario',
                columnNames: ['usuario_id'],
                referencedColumnNames: ['usuario_id'],
                referencedTableName: 'usuarios',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('paginas', 'PaginaDocumento');
        await queryRunner.dropColumn('paginas', 'documento_id');

        await queryRunner.dropForeignKey('paginas', 'PaginaUsuario');
        await queryRunner.dropColumn('paginas', 'usuario_id');
    }
}
