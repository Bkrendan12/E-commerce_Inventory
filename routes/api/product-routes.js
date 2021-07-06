const router = require("express").Router();

const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  let results = await Product.findAll();
  res.send(results);
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    // find a single product by its `id`
    // be sure to include its associated Category and Tag data
    let results = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
        },
      ],
    });
    res.send(results);
  } catch (err) {
    console.error(err);
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    let product = await Product.create(req.body);

    // if there's product tags, we need to create pairings to bulk create in the ProductTag model

    if (req.body.tag_ids) {
      const productTagIdArr = req.body.tag_ids.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      let productTags = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(200).json(productTags);
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      // update product data
      .then((product) => {
        // find all associated tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((productTags) => {
        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tag_ids
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tag_ids.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    let results = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send(200, results);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
