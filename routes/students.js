const express = require('express');
const router = express.Router();

const monk = require('monk');
const db = monk('localhost:27017/university');

router.get('/', (req, res) => {
    const collection = db.get('students');
    collection.find({}, (err, students) =>  {
        if(err) throw err;
        res.json(students);
    });
});

router.get('/:id', (req, res) => {
    const collection = db.get('students');
    collection.findOne({ _id: req.params.id }, (err, student) => { 
        if(err) throw err;
        res.json(student);
    });
});

router.put('/:id', (req, res) => {
    const collection = db.get('students');
    collection.update({
        _id : req.params.id,
    }, 
        { $set: {
            name: req.body.name,
            surname: req.body.surname,
            district: req.body.district,
            city: req.body.city,
            street: req.body.street,
            department: req.body.department._id,
            speciality: req.body.speciality._id,
            birthdate: new Date(req.body.birthdate)
        }
    }, (err, student) => {
        if(err) throw err;
        res.json(student);
    });
});

router.delete('/:id', (req, res) => {
    const collection = db.get('students');
    collection.remove( { _id:req.params.id } , (err) => {
        if(err) throw err;
        res.sendStatus(204);
    })
})
router.post('/', (req, res) => {
    const collection = db.get('students');
    collection.insert({
        name: req.body.name,
        surname: req.body.surname,
        district: req.body.district,
        city: req.body.city,
        street: req.body.street,
        department: req.body.department,
        speciality: req.body.speciality,
        birthdate: new Date(req.body.birthdate)

    }, (err, student) => { 
        if(err) throw err;
        res.json(student)
    });
});

module.exports = router;