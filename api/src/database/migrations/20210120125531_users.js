
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('type').notNullable().defaultTo('regular')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('type')
  })
}
