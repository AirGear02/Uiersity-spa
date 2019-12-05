const express = require('express');
const router = express.Router();

const monk = require('monk');
const db = monk('localhost:27017/university');

router.get('/', (req, res) => {
    const collection = db.get('subjects');
    collection.find({}, (err, subject) =>  {
        if(err) throw err;
        res.json(subject);
    });
});

router.get('/:id', (req, res) => {
    const collection = db.get('subjects');
    collection.findOne({ _id: req.params.id }, (err, subject) => { 
        if(err) throw err;
        res.json(subject);
    });
});

router.put('/:id', (req, res) => {
    const collection = db.get('subjects');
    collection.update( req.params.id, { 
        $set: {
            name: req.body.name,
        }
    }, (err, subject) => {
        if(err) throw err;
        res.json(subject);
    });
});

router.delete('/:id', (req, res) => {
    const collection = db.get('subjects');
    collection.remove( { _id:req.params.id } , (err) => {
        if(err) throw err;
        res.sendStatus(204);
    })
})
router.post('/', (req, res) => {
    const collection = db.get('subjects');
    collection.insert({
        name: req.body.name,

    }, (err, subject) => { 
        if(err) throw err;
        res.json(subject)
    });
});

module.exports = router;