const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) =>{
    let listings = await Listing.find();
    res.render("index.ejs", { listings });
}

module.exports.newRoute = (req,res) =>{
    
    res.render("new.ejs");
};

module.exports.createlisting =async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query:req.body.listing.location, 
        limit:1,
    }).send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  };

  module.exports.editlisting = async (req,res) =>{
      let {id} = req.params;
      let listing = await Listing.findById(id);
      if(!listing){
          req.flash("error", "Listing Does Not Exist");
          return res.redirect("/listings");
      }

      let originalImageUrl = listing.image.url;
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
      console.log(originalImageUrl)
      res.render("edit.ejs", { listing,originalImageUrl });
      
  };

  module.exports.updateListing = async (req,res) =>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
};

module.exports.showlisting = async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate:{ path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing Does Not Exist");
        return res.redirect("/listings");
    }
    res.render("show.ejs", { listing });

};

module.exports.deletelisting = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id).then((res) => {console.log("deleted")}).catch((err) => {console.log(err)});
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};