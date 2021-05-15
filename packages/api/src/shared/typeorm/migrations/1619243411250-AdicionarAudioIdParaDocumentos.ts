import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AdicionarAudioIdParaDocumentos1619243411250
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'documentos',
            new TableColumn({
                name: 'audio_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            'documentos',
            new TableForeignKey({
                name: 'DocumentoAudio',
                columnNames: ['audio_id'],
                referencedColumnNames: ['audio_id'],
                referencedTableName: 'audios',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('documentos', 'DocumentoAudio');
        await queryRunner.dropColumn('documentos', 'audio_id');
    }
}
