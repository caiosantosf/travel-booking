import axios from 'axios'

const apiUrl = 'http://localhost:3300/'

const api = axios.create({
  baseURL: apiUrl
})

const apiCep = cep => (axios.get(`https://viacep.com.br/ws/${cep}/json/`))

export { api, apiCep, apiUrl }