const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },


    addThought({ body }, res) {
      Thought.create(body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
        .then(userData => {
          if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(userData);
        })
        .catch(err => res.json(err));
    },
  
    addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )
        .then(commentData => {
          if (!commentData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(commentData);
        })
        .catch(err => res.json(err));
    },
  
    removeThought({ params }, res) {
      Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(deletedThought => {
          if (!deletedThought) {
            return res.status(404).json({ message: 'No thought with this id!' });
          }
        })
        .then(thoughtData => {
            User.findOneAndUpdate(
                { _id: thoughtData.userId },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
        })
        .then(userData => {
          if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(userData);
        })
        .catch(err => res.json(err));
    },

    removeReaction({ params }, res) {
      Thought.findOneAndUpdate(
        { _id: params.commentId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
        .then(commentData => res.json(commentData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;