// const Material = require('../models/Material');

// exports.addMaterial = async (req, res) => {
//   const {
//     materialName,
//     materialType,
//     weights,
//     weight,
//     quantity,
//     shift
//   } = req.body;

//   const material = new Material({
//     materialName,
//     materialType,
//     weights,
//     weight,
//     quantity,
//     shift
//   });

//   await material.save();
//   res.status(201).json(material);
// };
// controllers/materialController.js

const Material = require('../models/Material');

exports.addMaterial = async (req, res) => {
  const {
    shift,
    employeeId,
    materials,
    totalWeight
  } = req.body;

  const material = new Material({
    shift,
    employee: employeeId,
    materials,
    totalWeight
  });

  await material.save();
  res.status(201).json(material);
};
