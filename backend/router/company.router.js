import express from "express"
import { errorHandler } from "../middlewares/global.middleware.js";
import { createCompany, deleteCompany, getCompanies, updateCompany } from "../controller/company.controller.js";
const companyRouter = express.Router();


companyRouter.post('/create',createCompany)
companyRouter.get('/get',getCompanies)
companyRouter.put('/update/:id',updateCompany)
companyRouter.delete('/delete/:id',deleteCompany)


companyRouter.use(errorHandler);

export default companyRouter;