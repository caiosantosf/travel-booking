
exports.up = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.boolean('departurePayment').defaultTo(false)
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.dropColumn('departurePayment')
  })
}
