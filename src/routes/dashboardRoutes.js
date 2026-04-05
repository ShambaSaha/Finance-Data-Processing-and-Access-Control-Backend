const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  summary,
  categorySummary,
  recent,
  monthlyTrends
} = require("../controllers/dashboardController");

// ✅ Main summary
router.get("/", auth, authorize("admin", "analyst", "viewer"), summary);

// ✅ Category-wise totals
router.get("/category", auth, authorize("admin", "analyst", "viewer"), categorySummary);

// ✅ Recent activity
router.get("/recent", auth, authorize("admin", "analyst", "viewer"), recent);

// ✅ Monthly trends
router.get("/monthly", auth, authorize("admin", "analyst", "viewer"), monthlyTrends);

module.exports = router;