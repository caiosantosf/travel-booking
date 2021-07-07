
exports.up = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.uuid('externalReferenceMP')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.dropColumn('externalReferenceMP')
  })
}
