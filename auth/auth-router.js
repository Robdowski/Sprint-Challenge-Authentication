const router = require('express').Router();
const Users = require('./users-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved.username);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = getJwtToken(user.username)
        res.status(200).json({
          token,
          message: `Welcome ${user.username}!`,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function getJwtToken (username) {
  const payload = {
    username,
  }

  const secret = process.env.JWT_SECRET || 'Have you ever put butter on a poptart?'

  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, secret, options)
}

module.exports = router;
