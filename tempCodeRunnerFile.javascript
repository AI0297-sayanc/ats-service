/* eslint-disable */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const CatSchema = new mongoose.Schema({
  naam: String,
  dhaam: String,
  boyesh: Number
});
const Cat = mongoose.model("Cat", CatSchema)
// console.log(JSON.stringify(CatSchema.paths, null, 2));
console.log(Object.values(Cat.schema.paths).map(p => ({ path: p.path, type: p.instance })));

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));