import { Schema, model } from "mongoose"

const paintingSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },

    artist: { type: String, required: true },

    genre: { type: String, required: true },

    description: { type: String, required: true },

    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    image: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/06/25/78/04/360_F_625780416_6NWHWOsGr0DdiikPnHQ75u4Fr5hKw0rA.jpg",
    },
  },

  {
    timestamps: true,
  }
)

export default model("Painting", paintingSchema)
