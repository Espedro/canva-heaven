import { Schema, model } from "mongoose"

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      maxLenght: 34,
      minLenght: 4,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    password: { type: String, required: true, minLenght: 6 },

    isAdmin: { type: Boolean, default: false },

    profilePic: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
    },

    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
)

export default model("User", userSchema)
