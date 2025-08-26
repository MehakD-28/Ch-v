const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

main()
.then((res) => {console.log("connected to db")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chav');
}

const initDB = async() => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner:"68a64df6c72496235cf7e2d4"}));
    initdata.data = initdata.data.map((obj) => ({...obj, geometry: { type: 'Point', coordinates: [106.5348, 38.7946 ] }}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();