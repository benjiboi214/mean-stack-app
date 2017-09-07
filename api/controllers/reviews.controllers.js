var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// GET all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {

  var hotelId = req.params.hotelId;
  console.log("GET hotelId", hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if (!hotel) {
        console.log("Hotel id not found in database", hotelId);
        response.status = 404;
        response.message = {
          "message" : "Hotel Id not found " + hotelId
        };
      } else {
        response.message = hotel.reviews ? hotel.reviews : [];
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

// Get single review for a hotel
module.exports.reviewsGetOne = function (req, res) {

  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;

  console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if (!hotel) {
        console.log("Hotel id not found in database", hotelId);
        response.status = 404;
        response.message = {
          "message" : "Hotel Id not found " + hotelId
        };
      } else {
        // Get the review
        response.message = hotel.reviews.id(reviewId);
        // If no message, send 404
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });
};
