const router = require('express').Router();

const { get } = require('http');
const {
    addThought,
    addReaction,
    removeThought,
    removeReaction,
    getAllThoughts,
    getThoughtById
} = require('../../controllers/thought-controller');


router
    .route('/')
    .get(getAllThoughts)
    .post(addThought);

router
    .route('/:thoughtId')
    .get(getThoughtById)
    .post(addReaction)
    .delete(removeThought);

router
    .route('/:thoughtId/:reactionId')
    .delete(removeReaction);     

module.exports = router;