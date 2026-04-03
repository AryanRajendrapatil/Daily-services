const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["plumber", "electrician", "painter", "carpenter", "cleaner", "gardener", "mechanic", "other"],
        default: "other",
        required: true
    }
});

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    address: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        }
    },
    role: {
        type: String,
        enum: ["client", "admin", "provider"],
        default: "provider"
    },
    serviceType: {
        type: String,
        enum: ["plumber", "electrician", "painter", "carpenter", "cleaner", "gardener", "mechanic", "other"],
        default: "other"
    },
    services: [serviceSchema],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    experience: {
        type: Number,
        required: true
    },
    document: {
        adhar_card_front: {
            type: String,
        },
        adhar_card_back: {
            type: String,
        },
        photo: {
            type: String,
        }
    }
}, { timestamps: true });

const Worker = mongoose.model("Worker", workerSchema);
module.exports = Worker;
const Service = mongoose.model("Service", serviceSchema);