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

    
}