const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//create a movie list
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const list = new List(req.body);
    try {
      const savedList = await list.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied");
  }
});

//delete a list
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("List has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied");
  }
});

//get a list
router.get("/", verify, async (req, res) => {
  const typeQuerry = req.query.type;
  const genreQuerry = req.query.genre;
  let list = [];
  try {
    if (typeQuerry) {
      if (genreQuerry) {
        list = await List.aggregate([
          {
            $sample: { size: 10 },
          },
          {
            $match: { type: typeQuerry, genre: genreQuerry },
          },
        ]);
      } else {
        list = await List.aggregate([
          {
            $sample: { size: 10 },
          },
          {
            $match: { type: typeQuerry},
          },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
