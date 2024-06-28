import express from "express"
import Painting from "../models/painting.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import isAuth from "../middleware/authentication.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
const router = express.Router()

//create

router.post("/create", isAuth, isAdmin, async (req, res) => {
  try {
    const { name, artist, genre, description, image } = req.body

    const paintingData = {
      name,
      artist,
      genre,
      description,
      image,
    }

    for (const property in paintingData) {
      if (!paintingData[property]) {
        delete paintingData.property
      }
    }

    const painting = await Painting.create(paintingData)

    res.status(201).json({ message: "Painting added succesfuly", painting })
  } catch (error) {
    console.log(" Error adding painting", error)
    res.status(500).json(error)
  }
})

// get all painting

router.get("/all", async (req, res) => {
  try {
    const allPainting = await Painting.find().populate({
      path: "reviews",
      populate: { path: "creator" },
    });
    console.log(allPainting[0]);

    res.json(allPainting)
  } catch (error) {
    console.log("Error fetching all paintings", error)
    res.status(500).json(error)
  }
})

// get single painting

router.get("/:paintingId", async (req, res) => {
  try {
    const { paintingId } = req.params

    const painting = await Painting.findById(paintingId).populate({
      path: "reviews",
      populate: { path: "creator" },
    });

    res.json(painting)
  } catch (error) {
    console.log("error fetching details single painting", painting)
  }
})

//edit painting

router.put("/:paintingId", isAuth, isAdmin, async (req, res) => {
  try {
    const { paintingId } = req.params
    const { name, artist, genre, description, image } = req.body
    const paintingData = {
      name,
      artist,
      genre,
      description,
      image,
    }
    for (const property in paintingData) {
      if (!paintingData[property]) {
        delete paintingData.property
      }
    }

    const updated = await Painting.findByIdAndUpdate(paintingId, paintingData, {
      new: true,
      runValidators: true,
    })

    res.json({ message: "painting was updated succesfuly", updated })
  } catch (error) {
    console.log("error editing the painting", error)
    res.status(500).json(error)
  }
})

//delete painting

router.delete("/:paintingID", isAuth, isAdmin, async (req, res) => {
  try {
    const { paintingID } = req.params
    const painting = await Painting.findById(paintingID).populate("reviews");

    for (const review of painting.reviews) {
      await User.findByIdAndUpdate(review.creator, {
        $pull: { reviews: review._id },
      })
      await Review.findByIdAndDelete(review._id)
    }

    const deleted = await Painting.findByIdAndDelete(paintingID)

    res.json({
      message: deleted.name + " Painting was deleted succesfully",
      deleted,
    })
  } catch (error) {
    console.log("error deleting the Painting", error)
    res.status(500).json(error)
  }
})

export default router
