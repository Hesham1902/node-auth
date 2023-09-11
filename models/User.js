const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter an password"],
    minlength: [6, "minimum password length is 6 characters"],
    set: value => {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(value, salt);
        return hashedPassword;
    }
  },
  recipes: [
    {
      title: {
        type: String,
        required: [true, "Please enter a recipe title"],
      },
      description: {
        type: String,
        required: [true, "Please enter a recipe description"],
      },
    },
  ],
});

// userSchema.post('save', function(doc,next) {
//     console.log('new user was created & saved',doc)
//     next()      //????????????????????
// })

// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

//Defining a new method inside the model called login to check if the email and password entered are correct.

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect Email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
