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

export { dateTimeBrazil, dateTimeDefault }