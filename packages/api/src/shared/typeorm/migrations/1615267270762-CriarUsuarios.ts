import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CriarUsuarios1615267270762 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'usuarios',
              columns: [
                {
                  name: 'usuario_id',
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
                  name: 'email',
                  type: 'varchar',
                  isNullable: false,
                  isUnique: true,
                },
                {
                  name: 'senha',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'papel',
                    type: 'varchar',
                    isNullable: false,
                    // isUnique: true - TODO remover UniqueKey da coluna.
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
        await queryRunner.dropTable('usuarios');
    }
}
