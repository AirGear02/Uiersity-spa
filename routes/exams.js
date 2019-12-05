const express = require('express');
const router = express.Router();

const monk = require('monk');
const db = monk('localhost:27017/university');

router.get('/', (req, res) => {
    const collection = db.get('exams');
    collection.find({}, (err, exams) =>  {
        if(err) throw err;
        res.json(exams);
    });
});

router.get('/:id', (req, res) => {
    const collection = db.get('exams');
    collection.findOne({ _id: req.params.id }, (err, exam) => { 
        if(err) throw err;
        res.json(exam);
    });
});

router.put('/:id', (req, res) => {
    const collection = db.get('exams');
    collection.update( req.params.id, { 
        $set: {
            student: req.body.student._id,
            lecturer: req.body.lecturer._id,
            subject: req.body.subject._id,
            mark: req.body.mark
        }
    }, (err, subject) => {
        if(err) throw err;
        res.json(subject);
    });
});

router.delete('/:id', (req, res) => {
    const collection = db.get('exams');
    collection.remove( { _id:req.params.id } , (err) => {
        if(err) throw err;
        res.sendStatus(204);
    })
})
router.post('/', (req, res) => {
    const collection = db.get('exams');
    collection.insert({
        student: req.body.student,
        lecturer: req.body.lecturer,
        subject: req.body.subject,
        mark: req.body.mark
    }, 
    (err, subject) => { 
        if(err) throw err;
        res.json(subject)
    });
});

module.exports = router;