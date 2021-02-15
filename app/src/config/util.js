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
  const date = new Date(dt)
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) {
    throw new Error("A Data de nascimento não é valida")
  }
  const ageDt = new Date(diffMs)
  return Math.abs(ageDt.getUTCFullYear() - 1970)
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

export { dateTimeBrazil, dateTimeDefault, calculateAge, calculateValue }