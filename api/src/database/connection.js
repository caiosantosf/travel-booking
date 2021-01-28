const knex = require('knex')
const { attachPaginate } = require('knex-paginate')
const configuration = require('../../knexfile')

const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development

const conn = knex(config)

attachPaginate()

module.exports = conn
