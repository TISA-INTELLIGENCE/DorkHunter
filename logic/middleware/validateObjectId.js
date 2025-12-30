const mongoose = require("mongoose");

const ValidateObjectId = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ message: "Not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Not found" });
  }

  next();
};

module.exports = ValidateObjectId;
