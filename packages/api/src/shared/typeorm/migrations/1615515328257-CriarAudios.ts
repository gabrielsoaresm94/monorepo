import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriarAudios1615515328257 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'audios',
                columns: [
                    {
                        name: 'audio_id',
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
                        name: 'tamanho',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'formato',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'assunto',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'descricao',
                        type: 'varchar',
                        isNullable: true,
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
        await queryRunner.dropTable('audios');
    }
}
