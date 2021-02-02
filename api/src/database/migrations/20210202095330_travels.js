
exports.up = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.dropColumn('departure')
  })
}

exports.down = function(knex) {
  table.datetime('departure').notNullable()
}