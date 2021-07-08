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
  const birthDate = new Date(dt.split('/').reverse().join('-') + ' 00:00:00')
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

  if (status === 'pending') statusToShow = {status, translated: 'Pendente (MP)', color: 'text-warning'}
  if (status === 'approved') statusToShow = {status, translated: 'Aprovado (MP)', color: 'text-success'}
  if (status === 'authorized') statusToShow = {status, translated: 'Pendente (MP)', color: 'text-warning'}
  if (status === 'in_process') statusToShow = {status, translated: 'Em Processamento (MP)', color: 'text-warning'}
  if (status === 'in_mediation') statusToShow = {status, translated: 'Em Disputa (MP)', color: 'text-warning'}
  if (status === 'rejected') statusToShow = {status, translated: 'Rejeitado (MP)', color: 'text-danger'}
  if (status === 'cancelled') statusToShow = {status, translated: 'Cancelado (MP)', color: 'text-danger'}
  if (status === 'refunded') statusToShow = {status, translated: 'Devolvido (MP)', color: 'text-danger'}
  if (status === 'charged_back') statusToShow = {status, translated: 'Estornado (MP)', color: 'text-danger'}
  if (status === 'created') statusToShow = {status, translated: 'Criado (MP)', color: 'text-warning'}
  if (status === '1') statusToShow = {status, translated: 'Confirmar (Pix)', color: 'text-warning'}
  if (status === '2') statusToShow = {status, translated: 'Confirmado (Pix)', color: 'text-success'}
  if (status === '3') statusToShow = {status, translated: 'Confirmar (Infinite)', color: 'text-warning'}
  if (status === '4') statusToShow = {status, translated: 'Confirmado (Infinite)', color: 'text-success'}
  if (status === '5') statusToShow = {status, translated: 'Confirmar (Formulario)', color: 'text-warning'}
  if (status === '6') statusToShow = {status, translated: 'Confirmado (Formulario)', color: 'text-success'}
  if (status === '7') statusToShow = {status, translated: 'No Embarque', color: 'text-success'}
  if (status === 'dependent') statusToShow = {status, translated: 'Dependente', color: 'text-success'}
  return statusToShow
}

const translatePixKeyType = keyType => {
  if (keyType === 'email') return 'Email'
  if (keyType === 'phone') return 'Telefone'
  if (keyType === 'cpf') return 'CPF'
  return ''
}

export { dateTimeBrazil, dateTimeDefault, calculateAge, calculateValue, translatePaymentStatus, translatePixKeyType }