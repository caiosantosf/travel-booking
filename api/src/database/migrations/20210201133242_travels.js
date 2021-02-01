
exports.up = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.string('imageName').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('imageName')
  })
}
