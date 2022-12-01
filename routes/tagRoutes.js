require("dotenv").config();
const router = require("express").Router();
require("dotenv").config();
const checkToken = require("../verificarToken");
const Tag = require("../models/Tag");
const Movie = require("../models/Movie");

//criar tag
router.post("/", checkToken, async (req, res) => {
  const { tag } = req.body;

  if (!tag) {
    res.status(422).json({ error: "a tag é obrigatoria" });
  }

  const tagg = {
    tag,
  };

  //criar
  try {
    const tagexist = await Tag.find({ tag });
    if (tagexist.length > 0) {
      res.status(400).json({ msg: "essa tag ja existe" });
    } else {
      await Tag.create(tagg);

      res.status(201).json({ msg: "Tag criada" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//listar todas as tags
router.get("/", checkToken, async (req, res) => {
  try {
    const tagg = await Tag.find();

    res.status(200).json(tagg);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//listar  videos de uma determinada tag

router.get("/:title_tag/videos", checkToken, async (req, res) => {
  const tag = req.params.title_tag;

  try {
    const tagmongo = await Tag.findOne({ tag });
    if (!tagmongo) {
      res.status(404).json({ message: "tag não encontrada" });
    }
    const movies = await Movie.find({ tag_id: tagmongo._id });
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//atualizar uma tag
router.put("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const { tag } = req.body;

  const tagg = {
    tag,
  };

  try {
    const updatedTag = await Tag.updateOne({ _id: id }, tagg);

    if (updatedTag.matchedCount === 0) {
      res.status(424).json({ message: "Tag não encontrada" });
      return;
    }

    res.status(200).json(tagg);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//deletar uma tag
router.delete("/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  const movies = await Movie.find({ tag_id: id });
  if (movies.length > 0) {
    res
      .status(404)
      .json({ message: "Existe um filme cadastrado com essa tag" });
  } else {
    const tagg = await Tag.findOne({ _id: id });

    if (!tagg) {
      res.status(424).json({ message: "Tag não encontrada" });
      return;
    }
    try {
      await Tag.deleteOne({ _id: id });

      res.status(200).json({ message: "Tag deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
});

module.exports = router;
