const mongoose = require("mongoose");
//https://app.greptile.com/chat/43802e44-d93a-45ee-ac8e-c10ca682029e?repo=github:callmeabhy/white_oasis:main:
const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  review: {
    type: String,
    required: true,
  },
  rating: {
    // Add rating field
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const oldAgeHomeSchema = new mongoose.Schema(
  {
    old_age_home_name: {
      type: String,
      required: true,
    },
    old_age_home_country: {
      type: String,
      required: true,
    },
    old_age_home_city: {
      type: String,
      required: true,
    },
    old_age_home_state: {
      type: String,
      required: true,
    },
    old_age_home_address: {
      type: String,
      required: true,
    },
    old_age_home_upi_id: {
      type: String,
      required: true,
    },
    opens_on: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use HH:mm (24-hour)`,
      },
    },
    closes_on: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use HH:mm (24-hour)`,
      },
    },

    working_days: {
      type: [
        {
          type: String,

          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      ],

      required: true,

      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },

        message: "At least one working day must be specified",
      },
    },
    is_appointment_enabled: {
      type: Boolean,

      default: false,
    },
    contact_numbers: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^\+?[\d\s-]{10,}$/.test(v); // Basic phone number validation
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
    ],
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    social_links: {
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
      whatsapp_group: {
        type: String,
        default: "",
      },
      youtube: {
        type: String,
        default: "",
      },
    },
    capacity: {
      type: Number,
      required: true,
    },
    occupied_seats: {
      type: Number,
      default: 0,
    },
    facilities: [
      {
        type: String,
      },
    ],
    services: [
      {
        type: String,
      },
    ],
    staff_info: {
      medical_staff: {
        type: Number,
        required: true,
      },
      care_workers: {
        type: Number,
        required: true,
      },
    },
    diet_type: {
      type: String,
      enum: ["Veg", "Non-Veg", "Both"],
      required: true,
    },
    fee_structure: {
      monthly: {
        type: Number,
        required: true,
      },
      yearly: {
        type: Number,
        required: true,
      },
    },
    avg_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    num_rating: {
      type: Number,
      default: 0,
    },
    num_review: [reviewSchema],
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      required: true,
    },
  },
  { timestamps: true }
);
oldAgeHomeSchema.pre("save", function (next) {
  const opens = parseInt(this.opens_on.split(":")[0]);
  const closes = parseInt(this.closes_on.split(":")[0]);
  if (opens >= closes) {
    next(new Error("Opening time must be before closing time"));
  }
  next();
});
module.exports = mongoose.model("OldAgeHome", oldAgeHomeSchema);
