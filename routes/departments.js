const express = require('express');
const router = express.Router();

const monk = require('monk');
const db = monk('localhost:27017/university');

router.get('/', (req, res) => {
    const collection = db.get('departments');
    collection.find({}, (err, departments) =>  {
        if(err) throw err;
        res.json(departments);
    });
});

router.get('/:id', (req, res) => {
    const collection = db.get('departments');
    collection.findOne({ _id: req.params.id }, (err, department) => { 
        if(err) throw err;
        res.json(department);
    });
});

router.put('/:id', (req, res) => {
    var collection = db.get('departments');
    if(req.body.specialities[req.body.specialities.length - 1].name.length < 1) {
        req.body.specialities.pop();
    }
    req.body.specialities.map(speciality => {if(speciality._id==null)speciality._id = monk.id()});
    collection.update(
       { _id: req.params.id }, 
        { $set: {
            name: req.body.name,
            specialities: req.body.specialities
        }
    }, (err, department) => {
        if(err) throw err;
        res.json(department);
    });
});

router.delete('/:id', (req, res) => {
    const collection = db.get('departments');
    collection.remove( { _id:req.params.id } , (err) => {
        if(err) throw err;
        res.sendStatus(204);
    })
})
router.post('/', (req, res) => {
    const collection = db.get('departments');
    if(req.body.specialities[req.body.specialities.length - 1].name.length < 1) {
        req.body.specialities.pop();
    }
    req.body.specialities.map(speciality => speciality._id = monk.id());
    collection.insert({
        name: req.body.name,
        specialities: req.body.specialities
    }, (err, department) => { 
        if(err) throw err;
        res.json(department)
    });
});

module.exports = router;