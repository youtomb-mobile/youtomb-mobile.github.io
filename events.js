const today = new Date()
const month = today.getMonth() + 1
const day = today.getDate()
const year = today.getFullYear()

if (month === 10 && day === 9 && year >= 2025) {
  alert("happy birthday youtomb mobile")
} else if (month === 1 && day === 1) {
  alert("happy new year")
}
