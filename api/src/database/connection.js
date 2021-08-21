const knex = require('knex')
const { attachPaginate } = require('knex-paginate')
const configuration = require('../../knexfile')

const config = process.env.NODE_ENV === 'test'    ? configuration.test  : 
               process.env.NODE_ENV === 'staging' ? configuration.staging :
               process.env.NODE_ENV === 'dev'     ? configuration.development :
                                                    configuration.production

const conn = knex(config)

attachPaginate()

module.exports = conn
