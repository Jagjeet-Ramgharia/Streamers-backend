const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

//create a movie
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const movie = new Movie(req.body);
    try {
      const savedMovie = await movie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied");
  }
});

//update a movie
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied");
  }
});

//delete a movie
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied");
  }
});

//get a movie
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get random movie
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    }else{
        movie = await Movie.aggregate([
            { $match: { isSeries: false } },
            { $sample: { size: 1 } },
          ]);
    }
    res.status(200).json(movie)
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all movies and series
router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const allMovies = await Movie.find();
        res.status(200).json(allMovies.reverse());
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Permission denied");
    }
  });

module.exports = router;
