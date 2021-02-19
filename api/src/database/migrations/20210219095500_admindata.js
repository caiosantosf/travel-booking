
exports.up = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.string('companyPaymentLink', 1000).alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.string('companyPaymentLink', 255).alter()
  })
}
