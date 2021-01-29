
exports.up = function (knex) {
  return knex.schema.createTable('travels', (table) => {
    table.increments('id').primary()
    table.string('description').notNullable()
    table.string('destination').notNullable()
    table.datetime('departure').notNullable()
    table.datetime('days').notNullable()
    table.decimal('value', 10, 2)
    table.integer('bus_id').notNullable()
    table.foreign('bus_id').references('buses.id')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('travels')
}