
exports.up = function (knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.boolean('infinitePay').defaultTo(false).alter()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.boolean('infinitePay').defaultTo(true).alter()
  })
}