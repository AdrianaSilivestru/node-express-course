const notFound = (req, res) => {
    res.status(404).send("Route does not exsit");
};

module.exports = notFound;