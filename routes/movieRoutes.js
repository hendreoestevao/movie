const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const checkToken = require("../verificarToken");
const Movie = require("../models/Movie");

router.post("/", checkToken, async (req, res) => {
  const { title, desc, tag } = req.body;

  if (!title) {
    res.status(422).json({ error: "o titulo é obrigatorio" });
  }
  if (!desc) {
    res.status(422).json({ error: "a descrição é obrigatorio" });
  }
  if (!tag) {
    res.status(422).json({ error: "a tag é obrigatoria" });
  }

  const movie = {
    title,
    desc,
    tag,
  };

  //criar
  try {
    await Movie.create(movie);
    res.status(201).json({ msg: "filme criado" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//puxar todos os videos

router.get("/", checkToken, async (req, res) => {
  try {
    const movies = await Movie.find();

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//puxar video pela id
router.get("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    const movie = await Movie.findOne({ _id: id });

    if (!movie) {
      res.status(424).json({ message: "filme não encontrado" });
      return;
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//atualizar video

router.put("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const { title, desc, tag } = req.body;

  const movie = {
    title,
    desc,
    tag,
  };

  try {
    const updatedMovie = await Movie.updateOne({ _id: id }, movie);

    if (updatedMovie.matchedCount === 0) {
      res.status(424).json({ message: "filme não encontrado" });
      return;
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//deletar um video

router.delete("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const movie = await Movie.findOne({ _id: id });

  if (!movie) {
    res.status(424).json({ message: "filme não encontrado" });
    return;
  }
  try {
    await Movie.deleteOne({ _id: id });

    res.status(200).json({ message: "Filme deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
