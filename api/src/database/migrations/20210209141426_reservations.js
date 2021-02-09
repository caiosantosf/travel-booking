
exports.up = function (knex) {
  return knex.schema.createTable('reservations', (table) => {
    table.increments('id').primary()
    table.integer('travel_id').notNullable()
    table.foreign('travel_id').references('travels.id')
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id')
    table.integer('dependent_id')
    table.foreign('dependent_id').references('dependents.id')
    table.integer('departureSeat')
    table.integer('returnSeat')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('reservations')
}