const setUserId = (req, res, next) => {
  req.user = {
    _id: '63c1e664cb5281170a8fb576', // Временное решение
  };

  next();
};

module.exports = { setUserId };
