const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  let results = await Category.findAll({
    include: [
      {
        model: Product,
      },
    ],
  });
  res.send(results);
});

router.get("/:id", async (req, res) => {
  let results = await Category.findByPk(req.params.id, {
    include: [
      {
        model: Product,
      },
    ],
  });

  res.send(results);
  // be sure to include its associated Products
});

router.post("/", async (req, res) => {
  try {
    let results = await Category.create(req.body);
    res.send(results);
  } catch (err) {
    console.error(err);
  }
});

router.put("/:id", async (req, res) => {
  let results = await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.send(200, results);
  // update a category by its `id` value
});

router.delete("/:id", async (req, res) => {
  let results = await Category.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.send(200, results);
  // delete a category by its `id` value
});

module.exports = router;
