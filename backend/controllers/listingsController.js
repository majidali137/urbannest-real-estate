const ListingModel = require("../models/listings");
const Listing = require("../models/listings");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const RoleModel = require("../models/role");

const createListing = async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json({ success: "Your listing has been created." });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Error while creating a listing." });
  }
};

const getListings = async (req, res) => {
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  if (req.user._id.toString() === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id })
        .sort({ [sort]: order })
        .exec();
      return res.status(200).json(listings);
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Error getting the listing" });
    }
  } else {
    res.status(401).json({ notFound: "No listings found" });
  }
};

const deleteListing = async (req, res) => {
  const listing = await Listing.findOne({ _id: req.params.id }).exec();
  if (!listing) {
    return res.status(404).json({ error: "Listing not found!" });
  }
  console.log(req.user.roles[0].name);
  if (
    req.user.roles[0].name === "admin" ||
    req.user._id.toString() === listing.userRef.toString()
  ) {
    try {
      await Listing.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ success: "Listing has been successfully deleted" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Error deleting the property" });
    }
  }
  if (req.user._id.toString() !== listing.userRef.toString()) {
    return res.status(404).json({ error: "Unauthorized user" });
  }
};

const updateListing = async (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
      if (err) res.status(400).json({ error: "User not found" });

      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
      }
      if (user._id !== listing.userRef.toString()) {
        return res.status(404).json({ error: "Unauthorized user" });
      }

      try {
        const updatedListing = await Listing.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        ).exec();

        res.status(200).json(updatedListing);
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error fetching the listings." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error fetching the listings." });
  }
};

const getOneListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Error fetching the listing" });
  }
};

const getAllListings = async (req, res) => {
  const { token } = req.cookies;
  try {
    let limit = parseInt(req.query.limit) || 9;
    var loggedUser = null;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
        if (err)
          res.status(400).json({ error: "User not found / Invalid token" });
        loggedUser = user;
      });
    }
    if (loggedUser?.roles?.[0]?.name === "admin") {
      const listings = await ListingModel.find();
      limit = listings.length;
    }

    const startIndex = parseInt(req.query.startIndex) || 0;

    let purpose = req.query.purpose;
    if (purpose === undefined || purpose === "all") {
      purpose = { $in: ["sell", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    let type = req.query.type;

    const filter = {
      title: { $regex: searchTerm, $options: "i" },
      purpose: purpose,
    };

    if (type && type !== "%5B%5D") {
      try {
        type = decodeURIComponent(type);
        type = JSON.parse(type);
      } catch (error) {
        console.log("Invalid json object");
      }
      filter.$or = type;
    }
    const listings = await Listing.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
      .exec();

    res.status(200).json(listings);
  } catch (error) {
    res.status(404).json({ error: "Error fetching the Listings" });
  }
};

const getFavorites = async (req, res) => {
  const loggedInUser = req.user;

  try {
    const user = await User.findById(loggedInUser._id).populate("favorites");
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error adding to favorites" });
  }
};
const addToFavorites = async (req, res) => {
  const loggedInUser = req.user;
  const { listingId } = req.body;

  try {
    const listing = await ListingModel.findById(listingId);
    if (!listing) {
      res.status(404).json({ error: "No such listing exists" });
    }
    const user = await User.findByIdAndUpdate(
      loggedInUser._id,
      { $addToSet: { favorites: listingId } },
      { new: true }
    );
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error adding to favorites" });
  }
};
const removeFromFavorites = async (req, res) => {
  const loggedInUser = req.user;
  const { listingId } = req.body;

  try {
    const listing = await ListingModel.findById(listingId);
    if (!listing) {
      res.status(404).json({ error: "No such listing exists" });
    }
    const user = await User.findByIdAndUpdate(
      loggedInUser._id,
      { $pull: { favorites: listingId } },
      { new: true }
    );
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error adding to favorites" });
  }
};

module.exports = {
  createListing,
  getListings,
  deleteListing,
  updateListing,
  getOneListing,
  getAllListings,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
};
