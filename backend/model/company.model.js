import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    industry: {
      type: String,
      required: [true, "Industry is required"],
      trim: true,
      enum: {
        values: [
          "IT",
          "Finance",
          "Manufacturing",
          "Healthcare",
          "Education",
          "Other",
        ],
        message: "{VALUE} is not a valid industry",
      },
    },

    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/,
        "Please enter a valid website URL",
      ],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      match: [
        /^\+?[0-9]{10,15}$/,
        "Please enter a valid phone number (10-15 digits, optional +)",
      ],
    },

    foundedYear: {
      type: Number,
      min: [1800, "Founded year cannot be earlier than 1800"],
      max: [new Date().getFullYear(), "Founded year cannot be in the future"],
    },

    employees: {
      type: Number,
      min: [1, "Employees must be at least 1"],
      max: [1000000, "Employees cannot exceed 1 million"],
    },

    revenue: {
      type: Number,
      min: [0, "Revenue cannot be negative"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const companyModel = mongoose.model("Company", CompanySchema);

export default companyModel;
