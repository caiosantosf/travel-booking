
exports.up = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.string('infinitePayUser')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('adminData', (table) => {
    table.dropColumn('infinitePayUser')
  })
}
