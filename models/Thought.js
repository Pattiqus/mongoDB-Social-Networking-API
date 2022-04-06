const { Schema, model, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: [true, "Reaction required"],
            minlength: 1,
            maxlength: 280,
        },
        username: {
            type: String,
            required: [true, "Username required"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                return date.toDateString();
            },
        },
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: [true, "Thought required"],
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                return date.toDateString()
            },
        },
        username: {
            type: String,
            required: [true, "Username required"],
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
    },
    
)