import axios from 'axios'

const apiUrl = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: apiUrl
})

const apiCep = cep => (axios.get(`https://viacep.com.br/ws/${cep}/json/`))

export { api, apiCep, apiUrl }