const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const checkToken = require("../verificarToken");
const Tag = require("../models/Tag");
const { request } = require("express");
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
    await Tag.create(tagg);
    res.status(201).json({ msg: "Tag criada" });
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

router.get("/random", checkToken, async (req, res) => {
  const tag = req.query.tag;
  let movie;
  try {
    if (tag === tag) {
      movie = await Movie.aggregate([{ $match: { tag: tag } }]);
    } else {
      movie = await Movie.aggregate([
        { $match: { tag: " " } },
        { $sample: { size: 1 } },
      ]);
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(err);
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
});

module.exports = router;
