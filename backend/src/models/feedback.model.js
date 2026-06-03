const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
    {
        token_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Token",
            required: true,
        },

        citizen_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            default: null,
            maxlength: 1000,
        },

        submitted_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    }
);

// Useful indexes
FeedbackSchema.index({ office_id: 1 });
FeedbackSchema.index({ citizen_id: 1 });
FeedbackSchema.index({ token_id: 1 }, { unique: true }); // One feedback per token
FeedbackSchema.index({ rating: 1 });

const FeedbackModel = mongoose.model("Feedback", FeedbackSchema);
module.exports = FeedbackModel;