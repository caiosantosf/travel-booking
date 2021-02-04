
exports.up = function(knex) {
  return knex.schema.alterTable('travelValues', (table) => {
    table.boolean('lapChild')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('travelValues', (table) => {
    table.dropColumn('lapChild')
  })
}
