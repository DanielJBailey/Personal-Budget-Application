const { model, Schema, SchemaTypes } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
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

const UserModel = model('User', UserSchema, 'users');

module.exports = {
  UserModel,
  UserSchema,
  default: UserSchema
};
