const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  budgets: {
    type: [Schema.Types.ObjectId],
    ref: 'Budget'
  }
});

UserSchema.pre('save', function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

const model = mongoose.model('User', UserSchema);

module.exports = {
  UserModel: model,
  UserSchema,
  default: UserSchema
};
