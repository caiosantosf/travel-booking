
exports.up = function(knex) {
  return knex.schema.alterTable('dependents', (table) => {
    table.string('document', 32).alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('dependents', (table) => {
    table.string('document', 14).alter()
  })
}
