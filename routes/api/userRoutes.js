const router = require('express').Router();
const { User, Thought } = require('../../models');

// # Retreive: GET all thoughts from the mongo DB
router.get('/', (req, res) => {
    Thoughts.find
})