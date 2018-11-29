const express = require('express');
const router = express.Router();

// Models
const Note = require('../models/Note');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/contact/add', (req, res) => {
  res.render('contact/new-note');
});

router.post('/contact/new-note', async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!description) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('contact/new-note', {
      errors,
      title,
      description
    });
  } else {
    const newNote = new Note({title, description});
    
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/contact');
  }
});

// Get All Notes
router.get('/contact', async (req, res) => {
  const notes = await Note.find( ).sort({date: 'desc'});
  res.render('contact/all-notes', { notes });
});

// Edit Notes


// Delete Notes
router.delete('/contact/delete/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Note Deleted Successfully');
  res.redirect('/contact');
});

module.exports = router;
