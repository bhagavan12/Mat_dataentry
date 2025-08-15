const Material = require('../models/Material');
const Discharge = require('../models/Discharge');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// Get total materials per month/year
exports.getMaterialTotals = async (req, res) => {
  try {
    const { year } = req.query;
    console.log("year",year);
    const matchStage = {};

    if (year) {
      matchStage.timestamp = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }

    const data = await Material.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { month: { $month: "$timestamp" }, year: { $year: "$timestamp" } },
          totalWeight: { $sum: "$totalWeight" },
          entries: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Materials by type
exports.getMaterialsByType = async (req, res) => {
  try {
    const data = await Material.aggregate([
      { $unwind: "$materials" },
      {
        $group: {
          _id: "$materials.materialType",
          totalWeight: { $sum: { $multiply: ["$materials.count", "$materials.weightPerItem"] } },
          totalCount: { $sum: "$materials.count" }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Discharge outputs
exports.getDischargeOutputs = async (req, res) => {
  try {
    const data = await Discharge.aggregate([
      {
        $group: {
          _id: "$itemType",
          totalWeight: { $sum: "$weight" },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Employee-wise material entries
exports.getEmployeeMaterialStats = async (req, res) => {
  try {
    const data = await Material.aggregate([
      {
        $group: {
          _id: "$employee",
          totalWeight: { $sum: "$totalWeight" },
          totalEntries: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employeeData"
        }
      },
      { $unwind: "$employeeData" },
      {
        $project: {
          _id: 0,
          employeeId: "$employeeData._id",
          name: "$employeeData.name",
          totalWeight: 1,
          totalEntries: 1
        }
      }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Discharge monthly/yearly totals
exports.getDischargeTrends = async (req, res) => {
  try {
    const { year } = req.query;
    const matchStage = {};

    if (year) {
      matchStage.timestamp = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }

    const data = await Discharge.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { month: { $month: "$timestamp" }, year: { $year: "$timestamp" } },
          totalWeight: { $sum: "$weight" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
