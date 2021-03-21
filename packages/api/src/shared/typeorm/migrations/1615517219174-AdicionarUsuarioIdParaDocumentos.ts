import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AdicionarUsuarioIdParaDocumentos1615517219174
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'documentos',
            new TableColumn({
                name: 'usuario_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            'documentos',
            new TableForeignKey({
                name: 'DocumentoUsuario',
                columnNames: ['usuario_id'],
                referencedColumnNames: ['usuario_id'],
                referencedTableName: 'usuarios',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('documentos', 'DocumentoUsuario');
        await queryRunner.dropColumn('documentos', 'usuario_id');
    }
}
