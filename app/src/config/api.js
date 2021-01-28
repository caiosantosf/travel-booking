import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3300/'
})


const apiCep = cep => (axios.get(`https://viacep.com.br/ws/${cep}/json/`))

export { api, apiCep }