const express = require('express');
const router = express.Router();

// Models
const Tarea = require('../models/tarea');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/tareas/add', isAuthenticated, (req, res) => {
  res.render('tareas/new-note');
});

router.post('/tareas/new-note', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Favor de escribir un titulo'});
  }
  if (!description) {
    errors.push({text: 'Favor de escribir una descripcion'});
  }
  if (errors.length > 0) {
    res.render('tareas/new-note', {
      errors,
      title,
      description
    });
  } else {
    const newNote = new Tarea({title, description});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Tarea añadida!');
    res.redirect('/tareas');
  }
});

// Get All Notes
router.get('/tareas', isAuthenticated, async (req, res) => {
  const tareas = await Tarea.find({user: req.user.id}).sort({date: 'desc'});
  res.render('tareas/all-notes', { tareas });
});

// Edit Notes
router.get('/tareas/edit/:id', isAuthenticated, async (req, res) => {
  const tareas = await Note.findById(req.params.id);
  if(note.user != req.user.id) {
    req.flash('error_msg', 'No autorizado');
    return res.redirect('/tareas');
  }
  res.render('tareas/edit-note', { tareas });
});

router.put('/tareas/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Tarea.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Nota actualizada!');
  res.redirect('/tareas');
});

// Delete Notes
router.delete('/tareas/delete/:id', isAuthenticated, async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Tarea Borrada!');
  res.redirect('/tareas');
});

module.exports = router;
