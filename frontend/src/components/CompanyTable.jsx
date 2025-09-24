import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaRegEdit, FaPlusCircle, FaSpinner } from "react-icons/fa";
import {
  fetchCompanies,
  deleteCompany,
  createCompany,
  updateCompany,
} from "../api/Company.Api";
import DataLoading from "./Loader";
import toast from "react-hot-toast";

const defaultForm = {
  name: "",
  industry: "",
  location: "",
  employees: null,
  revenue: null,
  isActive: true,
};

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    isActive: "",
    industry: "",
    location: "",
    minEmployees: "",
    maxEmployees: "",
  });

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetchCompanies({ page, limit, ...filters });
      setCompanies(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(err?.data?.message || "Error Occured while fetching!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [page, filters]);

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this company?</span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-2"
              onClick={async () => {
                try {
                  setActionLoading(true);
                  await deleteCompany(id);
                  loadCompanies();
                  toast.dismiss(t.id);
                  toast.success("Company deleted successfully!");
                } catch (err) {
                  toast.dismiss(t.id);
                  toast.error("Failed to delete company!");
                } finally {
                  setActionLoading(false);
                }
              }}
            >
              {actionLoading ? <DataLoading /> : "Delete"}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const openEditModal = (company) => {
    setEditId(company._id);
    setFormData({
      name: company.name || "",
      industry: company.industry || "IT",
      location: company.location || "",
      foundedYear: company.foundedYear || "",
      employees: company.employees || 1,
      revenue: company.revenue || 0,
      website: company.website || "",
      email: company.email || "",
      phone: company.phone || "",
      isActive: company.isActive ?? true,
      description: company.description || "",
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (editId) {
        await updateCompany(editId, formData);
        toast.success("Company updated successfully!");
      } else {
        await createCompany(formData);
        toast.success("Company created successfully!");
      }
      setIsModalOpen(false);
      loadCompanies();
    } catch (err) {
      toast.error(err?.data?.message || "Error Occured while fetching!");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-blue-600 rounded"></span>
            Companies
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all registered companies
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 
                     hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 
                     rounded-xl shadow-md transition transform hover:scale-105"
        >
          <span className="p-1.5 rounded-full bg-white/20">
            <FaPlus className="text-white" />
          </span>
          <span className="font-medium">Add Company</span>
        </button>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg space-y-5">
        <div className="w-[70%] mx-auto mb-6 p-4 bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, isActive: e.target.value }))
              }
              className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={filters.industry}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, industry: e.target.value }))
              }
              className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            >
              <option value="">All Industries</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
            <input
              type="number"
              placeholder="Min Employees"
              value={filters.minEmployees}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minEmployees: e.target.value }))
              }
              className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
            <input
              type="number"
              placeholder="Max Employees"
              value={filters.maxEmployees}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxEmployees: e.target.value }))
              }
              className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto border-1 border-gray-300  rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 border-1 border-gray-300 text-center">S.No</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-center">Actions</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-left">Name</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-left">Industry</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-left">Location</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-center">Employees</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-center">Founded</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-left">Revenue</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-left">Website</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-left">Email</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-left">Phone</th>
                <th className="py-3 px-4 border-1 border-gray-300 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="12" className="h-52">
                    <DataLoading />
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    className="text-center text-gray-500 py-6 font-medium"
                  >
                    No companies found
                  </td>
                </tr>
              ) : (
                companies.map((c, index) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-2 px-4 text-center border-1 border-gray-300 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-1 border-gray-300">
                      <span className="flex justify-center items-center gap-2">
                        <button
                          className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 shadow-sm transition duration-200"
                          onClick={() => openEditModal(c)}
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 shadow-sm transition duration-200"
                          onClick={() => handleDelete(c._id)}
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </span>
                    </td>
                    <td className="py-2 px-4 border-1 border-gray-300 font-semibold text-gray-800">{c.name}</td>
                    <td className="py-2 px-4 border-1 border-gray-300 text-gray-600">{c.industry}</td>
                    <td className="py-2 px-4 border-1 border-gray-300 text-gray-600">{c.location}</td>
                    <td className="py-2 px-4 border-1 border-gray-300 text-center text-gray-700">{c.employees}</td>
                    <td className="py-2 px-4 border-1 border-gray-300 text-center text-gray-700">{c.foundedYear}</td>
                    <td className="py-2 px-4 border-1 border-gray-300 font-semibold text-green-600">
                      ₹{c.revenue.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-1 text-center border-gray-300">
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
                    <td className="py-2 px-4 border-1 border-gray-300 text-gray-600">{c.email}</td>
                    <td className="py-2 px-4 border-1 border-gray-300 text-gray-600">{c.phone}</td>
                    <td className="py-2 px-4 border-1 border-gray-300 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          c.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {editId ? <FaRegEdit className="text-blue-600" /> : <FaPlusCircle className="text-green-600" />}
              {editId ? "Edit Company" : "Add Company"}
            </h2>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border px-3 py-2 rounded-lg"
              />
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
                className="border px-3 py-2 rounded-lg"
              >
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Founded Year"
                value={formData.foundedYear || ""}
                min={1800}
                max={new Date().getFullYear()}
                onChange={(e) =>
                  setFormData({ ...formData, foundedYear: parseInt(e.target.value) })
                }
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Employees"
                value={formData.employees}
                min={1}
                onChange={(e) =>
                  setFormData({ ...formData, employees: parseInt(e.target.value) })
                }
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Revenue"
                value={formData.revenue}
                min={0}
                onChange={(e) =>
                  setFormData({ ...formData, revenue: parseInt(e.target.value) })
                }
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="url"
                placeholder="Website (https://...)"
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone (+91...)"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border px-3 py-2 rounded-lg"
              />
              <select
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.value === "true" })
                }
                className="border px-3 py-2 rounded-lg"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <textarea
                placeholder="Description (max 500 chars)"
                value={formData.description || ""}
                maxLength={500}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border px-3 py-2 rounded-lg col-span-2 h-24 resize-none"
              />
              <div className="flex justify-end gap-2 col-span-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex items-center justify-center gap-2"
                >
                  {actionLoading && <FaSpinner />}
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
