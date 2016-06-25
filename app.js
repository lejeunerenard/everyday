import assign from 'object-assign'
import defined from 'defined'

function formatDate (date) {
  if (!date) {
    return ''
  }

  return date.getYear() + '.' + date.getMonth() + date.getDate()
}

function isToday (date) {
  return formatDate(date) === formatDate(new Date())
}

export default class App {
  constructor (storage = localStorage, opt = {}) {
    let checkbox = defined(opt.checkbox, document.getElementById('done'))

    let dones = JSON.parse(storage.getItem('dones')) || []
    let latest = dones.length ? dones[dones.length - 1] : {}

    let today = isToday(new Date(latest.date))

    assign(this, {
      checkbox,
      storage,
      dones,
      today
    })
  }

  updateCheckbox (checked = this.today) {
    this.checkbox.checked = checked
  }

  addEvents () {
    this.checkbox.addEventListener('change', (e) => {
      this.today = !!this.checkbox.checked
      if (this.today) {
        this.dones.push({ date: new Date() })
        this.storage.setItem('dones', JSON.stringify(this.dones))
      } else {
        this.dones = this.dones.filter((done) => {
          return !isToday(new Date(done.date))
        })

        this.storage.setItem('dones', JSON.stringify(this.dones))
      }
    })
  }

  run () {
    this.addEvents()
    this.updateCheckbox()
  }
}
