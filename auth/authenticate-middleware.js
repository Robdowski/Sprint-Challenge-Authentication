const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  const secret = process.env.JWT_SECRET || 'Have you ever put butter on a poptart?'

  if (token) {
    jwt.verify(token, secret, (err, decodedtoken) =>{
      if(err){
        res.status(401).json(err)
      } else {
        req.decodedJwt = decodedtoken
        next()
      }
    })
  } else {
    res.status(400).json({Error: "No credentials provided."})
  }
}
