import { User, Thought} from '../../models';

export class userController {
    /**
     * Function: getUser
     * Description: Retreives all users from the database
     * @param {*} req 
     * @param {*} res 
     */
    getUser = async(req, res) => {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err))
    }

    /**
     * Function: getOneUser
     * Description: Retrieves one user from the database
     * @param {*} req 
     * @param {*} res 
     */
    getOneUser = async(req, res) => {
        User.findOne({ _id: req.params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    }

    /**
     * Function: createUser
     * Description: Creates a new user and stores in the database
     * @param {*} req 
     * @param {*} res 
     */
    createUser = async(req, res) => {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err))
    }

    /**
     * Function: updateUser
     * Description: Updates and existing user
     * @param {*} req 
     * @param {*} res 
     */
    updateUser = async(req, res) => {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found with that ID!' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    }

    /**
     * Function: deleteUser
     * Description: Removes a user and all associated thoughts
     * @param {*} req 
     * @param {*} res 
     */
    deleteUser = async(req, res) => {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) => {
            !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : Thought.deleteMany({ _id: { $in: user.thought } })

        })
        .then(() => res.json({ message: 'User successfully deleted!' }))
        .catch((err) => res.status(500).json(err));
    }

    /**
     * Function: addFriend
     * Description: adds a new friend to the indentified users friends list
     * @param {*} req 
     * @param {*} res 
     */
    addFriend = async(req, res) => {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    }

    /**
     * Function: removeFriend
     * Description: removes a friend from the users friend list
     * @param {*} req 
     * @param {*} res 
     */
    removeFriend = async(req, res) => {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found with that ID' })
                    : res.json({ message: 'User successfully removed from your friends list' })
            )
            .catch((err) => res.status(500).json(err));
    }
};