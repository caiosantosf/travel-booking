
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('cpf', 11).notNullable().defaultTo('').alter()
    table.string('phone', 11).notNullable().defaultTo('').alter()
    table.string('documentType', 3).notNullable().defaultTo('').alter()
    table.string('document', 14).notNullable().defaultTo('').alter()
    table.string('cep', 8).notNullable().defaultTo('').alter()
    table.string('address').notNullable().defaultTo('').alter()
    table.integer('addressNumber').notNullable().defaultTo('0').alter()
    table.string('complement').defaultTo('').alter()
    table.string('neighborhood').notNullable().defaultTo('').alter()
    table.string('city').notNullable().defaultTo('').alter()
    table.string('state', 2).notNullable().defaultTo('').alter()
    table.date('birth', 2).notNullable().defaultTo(new Date().toUTCString()).alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('cpf', 11).notNullable().alter()
    table.string('phone', 11).notNullable().alter()
    table.string('documentType', 3).notNullable().alter()
    table.string('document', 14).notNullable().alter()
    table.string('cep', 8).notNullable().alter()
    table.string('address').notNullable().alter()
    table.integer('addressNumber').notNullable().alter()
    table.string('complement').alter()
    table.string('neighborhood').notNullable().alter()
    table.string('city').notNullable().alter()
    table.string('state', 2).notNullable().alter()
    table.date('birth', 2).notNullable().alter()
  })
}
