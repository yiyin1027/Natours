const fs = require('fs');
const Tour = require("./../models/tourModels");

exports.checkBody = (req, res, next) => {
  if(!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: "fail",
      error: "no name or price"
    });
  }
  next();
} 

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch(err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }  
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      tour: newTour
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
}; 

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch(err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
  
}

exports.deleteTour = async (req, res) => {
  try{

    await Tour.findByIdAndRemove(req.params.id);

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch(err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
  
}

exports.getAllTours = async (req, res) => {
  try{
    //build query
    //1a. filtering
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //2b.advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` );

    console.log(JSON.parse(queryStr));

    // {difficulty: "easy", duration: {$gte : 5}}
    // {difficulty: "easy", duration: {gte: "5"}}
    let query = Tour.find(JSON.parse(queryStr));

    //2.Sorting 
    if(req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //3.Field limiting
    if(req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("");
    }

    //execute query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch(err) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
}