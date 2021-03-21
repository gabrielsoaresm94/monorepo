import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriarPaginas1615515319680 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'paginas',
                columns: [
                    {
                        name: 'pagina_id',
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
        await queryRunner.dropTable('paginas');
    }
}
