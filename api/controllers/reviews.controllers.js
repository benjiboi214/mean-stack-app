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

var _addReview = function(req, res, hotel) {

  hotel.reviews.push({
    name : req.body.name,
    rating : parseInt(req.body.rating, 10),
    review : req.body.review
  });

  hotel.save(function(err, hotelUpdated) {
    if (err) {
      console.log("Error saving hotel review");
      res
        .status(500)
        .json(err);
    } else {
      var updatedReview = hotelUpdated.reviews[hotelUpdated.reviews.length - 1];
      console.log("Updated review", updatedReview);
      res
        .status(201)
        .json(updatedReview);
    }
  });

};

module.exports.reviewsAddOne = function(req, res) {

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
      }
      if (hotel) {
        _addReview(req, res, hotel);
      } else {
        res
          .status(response.status)
          .json(response.message);
      }
    });

};

module.exports.reviewsUpdateOne = function(req, res) {

  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;

  console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var review;
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
        thisReview = hotel.reviews.id(reviewId);
        // If no message, send 404
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;

        hotel.save(function(err, hotelUpdated) {
          if (err) {
            console.log("Error saving hotel review");
            res
              .status(500)
              .json(err);
          } else {
            console.log("Updated review");
            res
              .status(204)
              .json();
          }
        });
      }
  });
};

module.exports.reviewsDeleteOne = function (req, res) {

  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;

  console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var review;
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
        thisReview = hotel.reviews.id(reviewId);
        // If no message, send 404
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        hotel.reviews.id(reviewId).remove();
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            console.log("Error saving hotel review");
            res
              .status(500)
              .json(err);
          } else {
            console.log("Deleted review");
            res
              .status(204)
              .json();
          }
        });
      }
  });

};
