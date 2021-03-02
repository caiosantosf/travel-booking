
exports.up = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.boolean('mercadoPago').defaultTo(false)
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.dropColumn('mercadoPago')
  })
}
