const { Thought, User } = require('../models')

module.exports = {
    /**
     * Function: getThoughts
     * Description: Retreives all thoughts on the mongoose database
     * @param {*} req 
     * @param {*} res 
     */
    getThoughts(req, res) {
        Thought.find({})
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err))
    },

    /**
     * Function: getOneThought
     * Description: Retrieves a single thought from the database using that thoughts ID
     * @param {*} req 
     * @param {*} res 
     */
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then((thought) => 
                !thought
                    ? res.status(404).json({ message: "No thought found with that ID"})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    /**
     * Function: createThought
     * Description: Creates a new thought from the user input into the API and saves it to the database
     * @param {*} req 
     * @param {*} res 
     */
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findByIdAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thought}},
                    { new: true, runValidators: true}
                )
            })
            .then((thought) => 
                !thought
                    ? res.status(404).json({
                        message: "No thought found with that ID"
                    })
                    : res.json({ message: 'Thought successfully created!'})
                )
                .catch((err) => res.status(500).json(err))
    },

    /**
     * Function: updateThought
     * Description: updates and existing thought in the database
     * @param {*} req 
     * @param {*} res 
     */
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true}
        )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err))
    },

    /**
     * Function: deleteThought
     * Description: removes a thought from the database
     * @param {*} req 
     * @param {*} res 
     */
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: 'No thought found with that ID' })
                    : res.json({ message: 'Thought successfully deleted!' })
            })
            .catch((err) => res.status(500).json(err));
    },

    /**
     * Function: createReaction
     * Description: Creates a reaction which is stored in the thoughts reaction field in the database
     * @param {*} req 
     * @param {*} res 
     */
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: 'No thought found with that ID' })
                    : res.json(thought)
            })
            .catch((err) => res.status(500).json(err));
    },

    /**
     * Function: deleteReaction
     * Description: Removes a reaction which is stored in the thoughts reaction field in the database
     * @param {*} req 
     * @param {*} res 
     */
    deleteReaction(req,res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: 'No thought found with that ID' })
                    : res.json({ message: 'Reaction successfully deleted' })
            })
            .catch((err) => res.status(500).json(err));
    }

};

