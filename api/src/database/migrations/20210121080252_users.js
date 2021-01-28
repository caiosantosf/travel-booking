
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('documentType', 3).notNullable()
    table.string('document', 14).notNullable()
    table.string('cep', 8).notNullable()
    table.string('address').notNullable()
    table.integer('addressNumber').notNullable()
    table.string('complement')
    table.string('neighborhood').notNullable()
    table.string('city').notNullable()
    table.string('state', 2).notNullable()
    table.date('birth', 2).notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('documentType')
    table.dropColumn('document')
    table.dropColumn('cep')
    table.dropColumn('address')
    table.dropColumn('addressNumber')
    table.dropColumn('complement')
    table.dropColumn('neighborhood')
    table.dropColumn('city')
    table.dropColumn('state')
    table.dropColumn('birth')
  })
}
