import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AdicionarUsuarioIdParaAudios1615517437565
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'audios',
            new TableColumn({
                name: 'usuario_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            'audios',
            new TableForeignKey({
                name: 'AudioUsuario',
                columnNames: ['usuario_id'],
                referencedColumnNames: ['usuario_id'],
                referencedTableName: 'usuarios',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('audios', 'AudioUsuario');
        await queryRunner.dropColumn('audios', 'usuario_id');
    }
}
