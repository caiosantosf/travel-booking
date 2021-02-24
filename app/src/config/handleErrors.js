const errorApi = (error) => {
  if (error.hasOwnProperty('response') && error.response) {

    let forbidden = false
    if (error.response.hasOwnProperty('status') && error.response.status) {
      forbidden = error.response.status === 401 ? true : false
    } else {
      forbidden = false
    }

    if (error.response.hasOwnProperty('data') && error.response.data) {
      if (error.response.data.hasOwnProperty('message') && error.response.data.message) {
        return { general: true, error: error.response.data.message, forbidden }
      } else {
        return { general: false, error: error.response.data, forbidden }
      }
    } else {
      return { general: true, error: 'Algo errado aconteceu, tente novamente mais tarde', forbidden }
    }
  } else {
    if (error.toString() === 'Error: Network Error') {
      return { general: true, error:'Erro de rede, o banco de dados está fora do ar', forbidden: false }
    } else {
      return { general: true, error:'Algo errado aconteceu, tente novamente mais tarde', forbidden: false }
    }
  }
}

export { errorApi }