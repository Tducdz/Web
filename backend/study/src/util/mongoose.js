module.exports = {
  mutipleMongooseToObject: function (mongooses) {
    if (!mongooses || !Array.isArray(mongooses)) {
      return [];
    }
    return mongooses.map((mongoose) => mongoose.toObject());
  },
  mongooseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
