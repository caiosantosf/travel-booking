const dateTime = str => {
  const dt = new Date(str)
  const day = dt.getDate().toString().padStart(2, '0')
  const month = (dt.getMonth() + 1).toString().padStart(2, '0')
  const year = dt.getFullYear()
  const hour = dt.getHours().toString().padStart(2, '0')
  const minute = dt.getMinutes().toString().padStart(2, '0')

  return { day, month, year, hour, minute }
}

const dateTimeBrazil = dt => {
  const { day, month, year, hour, minute } = dateTime(dt)
  return `${day}/${month}/${year} ${hour}:${minute}`
}

const dateTimeDefault = dt => {
  const { day, month, year, hour, minute } = dateTime(dt)
  return `${year}-${month}-${day}T${hour}:${minute}`
}

const calculateAge = dt => { 
  const today = new Date()
  const birthDate = new Date(dt)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1
  }
  return age
}

const calculateValue = (values, age, travelType, lapChild) => {
  let value = 0.00
  let optionLapChild = false

  for (const val of values) {
    if ((age >= val.initialAge) && (age <= val.finalAge)) {
      if (val.lapChild) {
        optionLapChild = true
      }
      if (val.lapChild === lapChild) {
        value = travelType === 'normal' 
                  ? val.value
                  : travelType === 'departure'
                    ? val.onlyDepartureValue
                    : val.onlyReturnValue
        break
      }
    }
  }
  
  return { value, optionLapChild}
}

const translatePaymentStatus = status => {
  let statusToShow = {}

  if (status === 'pending') statusToShow = {status, translated: 'Pendente', color: 'text-warning'}
  if (status === 'approved') statusToShow = {status, translated: 'Aprovado', color: 'text-success'}
  if (status === 'authorized') statusToShow = {status, translated: 'Pendente', color: 'text-warning'}
  if (status === 'in_process') statusToShow = {status, translated: 'Em Processamento', color: 'text-warning'}
  if (status === 'in_mediation') statusToShow = {status, translated: 'Em Disputa', color: 'text-warning'}
  if (status === 'rejected') statusToShow = {status, translated: 'Rejeitado', color: 'text-danger'}
  if (status === 'cancelled') statusToShow = {status, translated: 'Cancelado', color: 'text-danger'}
  if (status === 'refunded') statusToShow = {status, translated: 'Devolvido', color: 'text-danger'}
  if (status === 'charged_back') statusToShow = {status, translated: 'Estornado', color: 'text-danger'}
  if (status === 'created') statusToShow = {status, translated: 'Criado', color: 'text-warning'}

  if (status === '1') statusToShow = {status, translated: 'Esperando', color: 'text-warning'}
  if (status === '2') statusToShow = {status, translated: 'Recebido', color: 'text-success'}

  return statusToShow
}

export { dateTimeBrazil, dateTimeDefault, calculateAge, calculateValue, translatePaymentStatus }