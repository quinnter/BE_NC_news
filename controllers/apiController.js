const { selectEndPoints } = require("../models/apiModels")

exports.getEndPoints = (req, res, next) => {
    selectEndPoints()
    .then(endpoints => {
        res.status(200).send({ endpoints })
    })
}