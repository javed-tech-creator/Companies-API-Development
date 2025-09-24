import mongoose from "mongoose";
import companyModel from "../model/company.model.js";
import { getPaginationParams } from "../util/pageValidation.js";
import ApiError from "../util/ApiError.js";

//  Create Company
export const createCompany = async (req, res, next) => {
  try {
    const company = new companyModel(req.body);
    await company.save();
    res.status(201).json({
      success: true,
      message: "Company Added Successfully",
      data: company,
    });
  } catch (err) {
    next(err);
  }
};

//  Get All Companies (with filters, search, pagination)
export const getCompanies = async (req, res, next) => {
  try {
    let { isActive, industry, location, minEmployees, maxEmployees } =
      req.query;
    const { page, limit, skip } = getPaginationParams(req);

    const filter = { isDeleted: false };

    if (isActive) filter.isActive = isActive;
    if (industry) filter.industry = industry;
    if (location) filter.location = location;
    if (minEmployees)
      filter.employees = { ...filter.employees, $gte: parseInt(minEmployees) };
    if (maxEmployees)
      filter.employees = { ...filter.employees, $lte: parseInt(maxEmployees) };

    const companies = await companyModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-createdAt -updatedAt -isDeleted");
    const total = await companyModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Company data fetched Successfully",
      total,
      page,
      limit,
      data: companies,
    });
  } catch (err) {
    next(err);
  }
};

//  Update Company
export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Id"));
    }
    const company = await companyModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!company) {
      return next(new ApiError(404, "Company not found"));
    }

    res.status(200).json({
      success: true,
      messsage: "Company data updated Successfully",
      data: company,
    });
  } catch (err) {
    next(err);
  }
};

//  Soft Delete Company
export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Id"));
    }

    const company = await companyModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!company) {
      return next(new ApiError(404, "Company not found or Already deleted"));
    }

    res
      .status(200)
      .json({ success: true, message: "Company deleted successfully" });
  } catch (err) {
    next(err);
  }
};
