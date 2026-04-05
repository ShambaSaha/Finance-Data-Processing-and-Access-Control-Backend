const Record = require("../models/Record");

// ================== CREATE ==================
exports.createRecord = async (req, res) => {
  try {
    const record = await Record.create({
      ...req.body,
      userId: req.user.id
    });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================== GET ==================
exports.getRecords = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 5
    } = req.query;

    let filter = { isDeleted: false };

    // 🔹 Filters
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // 🔍 Search
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } }
      ];
    }

    // 🔹 Pagination
    const skip = (page - 1) * limit;

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json(records);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================== UPDATE ==================
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false }, // ✅ prevent updating deleted
      req.body,
      { returnDocument: "after" }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================== DELETE (SOFT) ==================
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false }, // ✅ prevent double delete
      { isDeleted: true },
      { returnDocument: "after" }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found or already deleted" });
    }

    res.json({ message: "Record soft deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restoreRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, isDeleted: true }, // only restore deleted
      { isDeleted: false },
      { returnDocument: "after" }
    );

    if (!record) {
      return res.status(404).json({
        message: "Record not found or not deleted"
      });
    }

    res.json({
      message: "Record restored successfully",
      record
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};