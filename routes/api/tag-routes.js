const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    let results = await Tag.findAll();
    res.send(results);
  } catch (err) {
    console.error(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let results = await Tag.findByPk(req.params.id);
    res.send(results);
  } catch (err) {
    console.error(err);
  }

  // be sure to include its associated Products
});

router.post("/", async (req, res) => {
  try {
    let results = await Tag.create(req.body);
    res.send(results);
  } catch (err) {
    console.error(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    let results = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.send(200, results);
  } catch (err) {
    console.error(err);
  }

  // update a Tag by its `id` value
});

router.delete("/:id", async (req, res) => {
  try {
    let results = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send(200, results);
  } catch (err) {
    console.error(err);
  }
  // delete a Tag by its `id` value
});

module.exports = router;
