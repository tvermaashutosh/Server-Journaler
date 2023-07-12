const mongoose = require('mongoose')
const { Schema } = mongoose

const formatDate = () => {
  const currentDate = new Date()
  const day = currentDate.toLocaleDateString('en-US', { weekday: 'short' })
  const month = currentDate.toLocaleDateString('en-US', { month: 'short' })
  const date = currentDate.toLocaleDateString('en-US', { day: '2-digit' })
  const year = currentDate.toLocaleDateString('en-US', { year: 'numeric' })
  const time = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  return `${day} ${date} ${month} ${year}, ${time}`
}

const EntrySchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: "General" },
  date: { type: String, default: formatDate }
}, { versionKey: false })

module.exports = mongoose.model('Entry', EntrySchema)
