const router = require("express").Router();

const clientRoutes = require("./clientRoutes");
const treatmentPlanRoutes = require("./treatmentPlanRoutes");

// connecting main routes
router.use("/clients", clientRoutes);

router.use("/treatment-plans", treatmentPlanRoutes);

module.exports = router;