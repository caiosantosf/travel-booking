
exports.up = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.boolean('pix').defaultTo(false)
    table.string('pixKeyType', 5)
    table.string('pixKey')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.dropColumn('pix')
    table.dropColumn('pixKeyType')
    table.dropColumn('pixKey')
  })
}
