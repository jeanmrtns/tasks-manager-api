import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').notNullable().primary()
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.datetime('completed_at')
    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks')
}
