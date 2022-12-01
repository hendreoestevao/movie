const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const checkToken = require("./verificarToken");
const movieRoute = require("./routes/movieRoutes");
const tagRoutes = require("./routes/tagRoutes");

app.use(express.json());

const User = require("./models/User");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "bem vindo a api" });
});

// Rota Privada

app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

//registrar usuario
app.post("/auth/regis", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) {
    res.status(422).json({ error: "o nome é obrigatorio" });
  }
  if (!email) {
    res.status(422).json({ error: "o email é obrigatorio" });
  }
  if (!password) {
    res.status(422).json({ error: "a senha é obrigatorio" });
  }
  if (password !== confirmpassword) {
    res.status(422).json({ error: "as senhas não conferem" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ error: "Por favor, utilize outro email!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await User.create(user);
    res.status(201).json({ message: "user criado" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // validations
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  // check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  //checar as senhas
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(404).json({ msg: "senha invalida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    res.status(200).json({ msg: "autenticação correta", token });
  } catch (error) {}
});

app.use("/videos", movieRoute);
app.use("/tags", tagRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao Banco");
    app.listen(3333);
  })
  .catch((err) => console.log(err));
