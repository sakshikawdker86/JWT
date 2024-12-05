const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const SECRET_KEY = "shdkhdskhsdakalkaksd";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader", authHeader);
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  console.log("token", token);
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    console.log("user", user);
    req.user = user;
    next();
  });
};

const user = [
  {
    name: "sakshi",
    password: "123456",
  },
];

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    // user find dummy data
    const findUser = user.find((data) => {
      return data.name === username && data.password === password;
    });

    console.log("findUser", findUser);

    // validate the user
    if (findUser?.name === username && findUser?.password === password) {
      const token = jwt.sign({ username: findUser.username }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.json({
        status: "success",
        data: { username: username, password: password, token: token },
      });
    }

    return res.json({
      status: "success",
      message: "Invalid username and password",
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/getUsers", authenticateToken, (req, res) => {
  try {
    const dummyData = [
      {
        name: "Mona Patel",
        age: 26,
        city: "dewas",
      },
      {
        name: "sakshi kawadkar",
        age: 27,
        city: "indore",
      },
    ];

    return res.json({ status: "success", data: dummyData });
  } catch (error) {
    console.log("Error", error);
  }
});

app.listen(port, () => {
  console.log("Server listing on port", port);
});
