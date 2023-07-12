const express = require('express')
const router = express.Router()
const Entry = require('../models/Entry')
const fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator')

// 1. Fetch all the entries using: GET 'api/entry/fetchallentries'
// Log in required
router.get('/fetchallentries', fetchUser, async (req, res) => {
  try {
    const entry = await Entry.find({ user: req.user.id })
    res.json(entry)
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send('Backend error')
  }
})

// 2. Add a new entry using: POST 'api/entry/addentry'
// Log in required
router.post('/addentry', fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body
    const entry = new Entry({
      title, description, tag, user: req.user.id,
    })
    const savedEntry = await entry.save()
    res.json(savedEntry)
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send('Backend error')
  }
})

// 3. Update an existing entry using: PUT '/api/entry/updateentry'
// Log in required
router.put('/updateentry/:id', fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body
    const newEntry = {
      title: title, description: description, tag: tag
    }

    let entry = await Entry.findById(req.params.id)
    if (!entry) {
      return res.status(404).send('Not Found')
    }
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed')
    }

    entry = await Entry.findByIdAndUpdate(req.params.id, { $set: newEntry }, { new: true })
    res.json({ entry })
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send('Backend error')
  }
})

// 4. Delete an existing entry using: DELETE '/api/entry/deleteentry'
// Log in required
router.delete('/deleteentry/:id', fetchUser, async (req, res) => {
  try {
    let entry = await Entry.findById(req.params.id)
    if (!entry) {
      return res.status(404).send('Not Found')
    }
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed')
    }

    entry = await Entry.findByIdAndDelete(req.params.id)
    res.json({ 'success': 'Entry deleted', entry: entry })
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send('Backend error')
  }
})

module.exports = router
