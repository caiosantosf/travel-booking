
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('homeAddress').notNullable().defaultTo('')
    table.dropColumn('address')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('address').notNullable().alter()
    table.dropColumn('homeAddress')
  })
}
