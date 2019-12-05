const express = require('express');
const router = express.Router();

const monk = require('monk');
const db = monk('localhost:27017/university');

router.get('/', (req, res) => {
    const collection = db.get('lecturers');
    collection.find({}, (err, lecturer) =>  {
        if(err) throw err;
        res.json(lecturer);
    });
});

router.get('/:id', (req, res) => {
    const collection = db.get('lecturers');
    collection.findOne({ _id: req.params.id }, (err, lecturer) => { 
        if(err) throw err;
        res.json(lecturer);
    });
});

router.post('/', (req, res) => {
    const collection = db.get('lecturers');

    //req.body.subjects.map(subject => subject = subject._id);
    collection.insert({
        name: req.body.name,
        surname: req.body.surname,
        middlename: req.body.middlename,
        subjects: req.body.subjects
    }, (err, lecturer) => { 
        if(err) throw err;
        res.json(lecturer)
    });
});

router.put('/:id', (req, res) => {
    const collection = db.get('lecturers');
    var subjects = new Array();
    req.body.subjects.map(subject => subjects.push(subject._id));
    collection.update({
        _id : req.params.id,
    }, 
        { $set: {
            name: req.body.name,
            surname: req.body.surname,
            middlename: req.body.middlename,
            subjects: subjects
        }
    }, (err, lecturer) => {
        if(err) throw err;
        res.json(lecturer);
    });
});

router.delete('/:id', (req, res) => {
    const collection = db.get('lecturers');
    collection.remove( { _id:req.params.id } , (err) => {
        if(err) throw err;
        res.sendStatus(204);
    })
})

module.exports = router;