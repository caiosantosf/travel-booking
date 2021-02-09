
exports.up = function (knex) {
  return knex.schema.createTable('dependents', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('documentType', 3).notNullable()
    table.string('document', 14).notNullable()
    table.date('birth').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('dependents')
}