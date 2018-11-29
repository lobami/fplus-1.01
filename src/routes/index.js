const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('index', {layout: 'index'});
});

//---------------------------------------contacto ------------------------------------------

// Models
const Note = require('../models/Contact');



// New Note
router.get('/contact/add', (req, res) => {
  res.render('contact/new-note');
});

router.post('/contact/new-note', async (req, res) => {
  const { title, description, nombre, correo, date, numero } = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Por favor escribe un titulo'});
  }
  if (!description) {
    errors.push({text: 'Es necesaria una descripcion'});
  }
  if (errors.length > 0) {
    res.render('contact/new-note', {
      errors,
      title,
      description,
      nombre,
      correo,
      date, 
      numero
    });
  } else {
    const newNote = new Note({title, description});
    
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/contact/all-notes');
  }
});

// Get All Notes
router.get('/contact', async (req, res) => {
  const notes = await Note.find({ }).sort({date: 'desc'})
  res.render('contact/all-notes', { notes });
});

// Edit Notes


// Delete Notes
router.delete('/contact/delete/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Note Deleted Successfully');
  res.redirect('/contact');
});

// ----------------------------------Fin de contacto--------------------------------------------

// ----------------------------------TAREAS-----------------------------------------------------
/*

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
    errors.push({text: 'Please Write a Title.'});
  }
  if (!description) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('tareas/new-note', {
      errors,
      title,
      description
    });
  } else {
    const newTarea = new Tarea({title, description});
    newTarea.user = req.user.id;
    await newTarea.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/tareas');
  }
});

// Get All Notes
router.get('/tareas', isAuthenticated, async (req, res) => {
  const notes = await Tarea.find({user: req.user.id}).sort({date: 'desc'});
  res.render('notes/all-notes', { notes });
});

// Edit Notes
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const tareas = await Tarea.findById(req.params.id);
  if(Tarea.user = req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/tareas');
  }
  res.render('notes/edit-note', { tareas });
});

router.put('/tareas/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Tarea.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Note Updated Successfully');
  res.redirect('/tareas');
});

// Delete Notes
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Note Deleted Successfully');
  res.redirect('/tareas');
});
*/
// ----------------------------------Fin de tareas__--------------------------------------------

module.exports = router;
