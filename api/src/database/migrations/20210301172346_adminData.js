
exports.up = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.string('mercadoPagoToken').defaultTo('')
    table.string('mercadoPagoPublicKey').defaultTo('')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.string('mercadoPagoPublicKey')
    table.string('mercadoPagoToken')
  })
}
