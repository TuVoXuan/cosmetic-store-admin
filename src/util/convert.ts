export const formatPrice = (price: number) => {
  return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

export const formatDate = (date: string) => {
  const d = new Date(date)

  return (
    [padTo2Digits(d.getDate()), padTo2Digits(d.getMonth() + 1), d.getFullYear()].join('/') +
    ' ' +
    [padTo2Digits(d.getHours()), padTo2Digits(d.getMinutes()), padTo2Digits(d.getSeconds())].join(':')
  )
}
