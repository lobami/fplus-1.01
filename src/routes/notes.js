const express = require('express');
const router = express.Router();

// Models
const Note = require('../models/Note');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/notes/add', (req, res) => {
  res.render('notes/new-note');
});

router.post('/notes/new-note', async (req, res) => {
  const { title, description, nombre, correo, date, numero } = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!description) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      title,
      description, 
      nombre,
      correo, 
      date,
      numero
    });
  } else {
    const newNote = new Note({ title, description, correo, nombre, numero });
    newNote.user = 'cliente';
    await newNote.save();
    req.flash('success_msg', 'Enviado');
    res.redirect('/');
  }
});

// Get All Notes
router.get('/notes',isAuthenticated, async (req, res) => {
  const notes = await Note.find({user: 'cliente'}).sort({date: 'desc'});
  res.render('notes/all-notes', { notes });
});

// Edit Notes
router.get('/notes/edit/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if(note.user != 'cliente') {
    req.flash('error_msg', 'No autorizado!!');
    return res.redirect('/notes');
  } 
  res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id', async (req, res) => {
  const { title, description, correo, nombre, date, numero } = req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Note Updated Successfully');
  res.redirect('/notes');
});

// Delete Notes
router.delete('/notes/delete/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Contacto borrado!');
  res.redirect('/notes');
});

module.exports = router;
