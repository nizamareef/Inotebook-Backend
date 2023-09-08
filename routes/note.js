const express = require('express');
const fetchdata = require('../middleware/fetchdata');
const Note = require('../Models/Note');
const router = express.Router();
const { body, validationResult } = require('express-validator')

//Router-1 FETCHING THE USER NOTES//
router.get('/fetchnotes', fetchdata, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.userid })
        res.send(notes)
    }
    catch (error) {
        return res.status(400).json({ errors: "error.array()" });
    }
})

//Router-2 ADD A NEW NOTE//
router.post('/addnote', fetchdata, [
    body('title').isLength({ min: 3 }),
    body('description').notEmpty(),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ "errors": error.array() });
        }
        const note = new Note({ title, description, tag, user: req.userid })
        const savedNote = await note.save();
        res.json(savedNote)

    } catch (error) {
        return res.status(400).send({ error: 'server error' });
    }

})
//Router-3 UPDATE A EXISTING NOTE 
router.post('/update/:id', fetchdata, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //Create a newNote//
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag }
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ "errors": error.array() });
        }
        //find the note to be updated//
        let note = await Note.findById(req.params.id);

        if (!note) { return res.json(404).send("Not Found") }
        if (note.user.toString() !== req.userid) {
            return res.status(401).send("Not Authorized")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch {
        return res.status(400).send({ error: 'server error' });
    }
})
//Router-4 DELETE A NOTE FROM NOTES//
router.delete('/delete/:id', fetchdata, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        if (note.user.toString() !== req.userid) {
            return res.status(401).send("Not Authorized")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note is deleted", note: note })
    }
    catch {
        return res.status(400).send({ error: "error in deleting" })
    }
})

module.exports = router