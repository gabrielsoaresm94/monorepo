import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriarDocumentos1615515295572 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'documentos',
                columns: [
                    {
                        name: 'documento_id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'nome',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'descricao',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'assunto',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'qtd_imagens',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'modified_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('documentos');
    }
}
