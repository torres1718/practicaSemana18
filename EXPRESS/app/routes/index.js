var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const fs =require('fs');
const data=require("../userData");
const methods=require("../methods");

//rutas
const registerRoute="../views/pages/register";
const loginRoute="../views/pages/login";
const contentRoute="../views/pages/content";
const rutaHome="../views/pages/home";



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Programacion Computacional IV' });
});

router.get("/home", function (req, res) {
  res.render(rutaHome);
});

router.get("/content", function (req, res) {
  res.render(contentRoute);
});

router.get("/register", (req, res) => {
  res.render(registerRoute);
});

router.get("/login", (req, res) => {
  res.render(loginRoute);
});

router.post("/register", (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  //verificar si los password coinciden
  if (password === confirmPassword) {
    //validar si el correo ya está registrado
    if (data.data.find((dat) => dat.email === email)) {
      res.render(registerRoute, {
        message: "El usuario ya está registrado",
        messageClass: "alert-danger",
      });
    }
    //encriptar el password
    const pHash = methods.getHashedPassword(password);

    //almacenar los datos
    data.data.push({
      fullName,
      email,
      password: pHash,
    });

    //guardar los datos en el archivo
    var jsonData = JSON.stringify(data.data);
    jsonData = `const data = ${jsonData} 
    
    module.exports = {
      data
  }`;

    fs.writeFile("userData.js", jsonData, (err) => {
      if (err) throw err;
    });

    res.render(loginRoute, {
      message: "Registro Completo. Inicie sesión",
      messageClass: "alert-success",
    });
  } else {
    res.render(registerRoute, {
      message: "La contraseñas no coinciden",
      messageClass: "alert-danger",
    });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const pHash = methods.getHashedPassword(password);

  // constante para comparar los datos, email, password
  //TRUE OR FALSE
  const dataUser = data.data.find((user) => {
    return user.email === email && pHash === user.password;
  });

  if (dataUser) {
    const authToken = methods.generateAuthToken();

    //almacenar el token de autenticacion
    methods.authTokens[authToken] = dataUser;
    //guardar el token en una cookie
    res.cookie("AuthToken", authToken);

    res.redirect("/home");
  } else {
    res.render(loginRoute, {
      message: "El usuario o contraseña no son válidos",
      messageClass: "alert-danger",
    });
  }
});

module.exports = router;
