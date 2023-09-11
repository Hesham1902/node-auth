const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { getId } = require('../middleware/authMiddleware')
//importantttttttttttttttttttttttttttttttttt
//handle errors
//محتاج مراجعة تاني
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };
  //incorrect email for login
  if (err.message === "incorrect Email") {
    errors.email = "this email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  //duplicate error
  if (err.code == 11000) {
    errors.email = "this email already registered";
    return errors;
  }
  //validation error -------------
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//Creating Token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "hesham maher secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password, title, description } = req.body;
  try {
    const user = await User.create({
      email,
      password,
      recipes: [{ title, description }],
    });
    res.locals.user = user; //passes the user data to views
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
  // const user = new User(req.body);
  // user.save()
  //     .then( result => {
  //     res.status(201).json(user)
  //     })
  //     .catch( err => res.status(400).send("error, user not created"))
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    console.log( req.user)
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  // removing the current token
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.update_recipe = async (req,res) => {
  const userId = getId();
  console.log(userId)
  const { title, description } = req.body;
  try {
    // Find the user by their ID and update the recipes array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the new recipe to the user's recipes array
    user.recipes.push({ title, description });

    // Save the updated user document
    await user.save();

    res.status(200).json(user.recipes); // Respond with the updated recipes array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.recipe_delete = async (req,res) => {

  const { userId, recipeId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove the recipe from the user's recipes array
    user.recipes.pull(recipeId);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



