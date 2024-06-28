import express from "express"
import Review from "../models/review.model.js"
import Painting from "../models/painting.model.js"
import User from "../models/user.model.js"
import isAuth from "../middleware/authentication.middleware.js"

const router = express.Router()

//create review

router.post("/:paintingID", isAuth, async (req, res) => {

  try { 

    const {paintingID} = req.params;
    
    const { title, review, rating } = req.body;

    const createdReview = await Review.create({
      title,
      review,
      rating,
      creator: req.user._id,
      painting: paintingID,
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { reviews: createdReview._id } },
      { new: true }
    );

    await Painting.findByIdAndUpdate(
      paintingID,
      { $push: { reviews: createdReview._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "review created succesfully", createdReview });

    
  } catch (error) { 
    console.log (error)
  }

} )

//delete review
router.delete("/:reviewId", isAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (review.creator.toString() !== req.user._id) {
      return res.status(401).json({ message: "You can't delete this review" });
    }

    await Painting.findByIdAndUpdate(review.coffee, {
      $pull: { reviews: review._id },
    });
    await User.findByIdAndUpdate(review.creator, {
      $pull: { reviews: review._id },
    });

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Your review was deleted succesfully" });
  } catch (error) {
    console.log("error while deleting review", error);
    res.status(500).json(error);
  }
});

export default router;



