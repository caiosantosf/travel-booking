
exports.up = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.dropColumn('days')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.datetime('days').notNullable()
  })
}
