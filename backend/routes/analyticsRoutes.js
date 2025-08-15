const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');
// Materials
router.get('/materials/total',auth, analyticsController.getMaterialTotals);
router.get('/materials/type',auth, analyticsController.getMaterialsByType);

// Discharges
router.get('/discharges/outputs',auth, analyticsController.getDischargeOutputs);
router.get('/discharges/trends',auth, analyticsController.getDischargeTrends);

// Employees
router.get('/employees/materials',auth, analyticsController.getEmployeeMaterialStats);

module.exports = router;
