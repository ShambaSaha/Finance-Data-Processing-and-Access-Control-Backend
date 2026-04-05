const Record = require("../models/Record");

// ================== SUMMARY ==================
exports.summary = async (req, res) => {
  try {
    // 🔹 Total Income
    const income = await Record.aggregate([
      { $match: { type: "income", isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 🔹 Total Expense
    const expense = await Record.aggregate([
      { $match: { type: "expense", isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 🔹 Category-wise totals
    const categoryTotals = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    // 🔹 Monthly trends (income vs expense)
    const monthlyRaw = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const months = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyMap = {};

    monthlyRaw.forEach(item => {
      const monthName = months[item._id.month];

      if (!monthlyMap[monthName]) {
        monthlyMap[monthName] = {
          month: monthName,
          income: 0,
          expense: 0
        };
      }

      if (item._id.type === "income") {
        monthlyMap[monthName].income = item.total;
      } else {
        monthlyMap[monthName].expense = item.total;
      }
    });

    const monthlyTrends = Object.values(monthlyMap);

    // 🔹 Recent activity
    const recent = await Record.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // ✅ Final response
    res.json({
      totalIncome: income[0]?.total || 0,
      totalExpense: expense[0]?.total || 0,
      netBalance:
        (income[0]?.total || 0) - (expense[0]?.total || 0),
      categoryTotals,
      monthlyTrends,
      recent
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================== CATEGORY ==================
exports.categorySummary = async (req, res) => {
  try {
    const data = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================== RECENT ==================
exports.recent = async (req, res) => {
  try {
    const data = await Record.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================== MONTHLY ==================
exports.monthlyTrends = async (req, res) => {
  try {
    const data = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const months = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const result = {};

    data.forEach(item => {
      const monthName = months[item._id.month];

      if (!result[monthName]) {
        result[monthName] = {
          month: monthName,
          income: 0,
          expense: 0
        };
      }

      if (item._id.type === "income") {
        result[monthName].income = item.total;
      } else {
        result[monthName].expense = item.total;
      }
    });

    res.json(Object.values(result));

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};