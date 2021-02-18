
exports.up = function (knex) {
  return knex.schema.createTable('adminData', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id')
    table.boolean('infinitePay').defaultTo(true)
    table.boolean('companyPayment').defaultTo(false)
    table.string('companyPaymentLink')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('adminData')
}