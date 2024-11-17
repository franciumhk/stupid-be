"use client";

import "../globals.css";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { AdminFormIfc, BusinessItemViewIfc } from "@/app/types/ifc";
import { BizSchema } from '../types/bizSchema';
import BizDetail from '@/app/displays/bizdetail';
import React from "react";
import { BACKEND_URL } from "../types/config";
import { DEFAULT_LIMITS } from "../types/const";
import AdminFormComponent from "@/app/forms/AdminForm";
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessItemViewIfc[]>([]);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<AdminFormIfc | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandedBusinesses, setExpandedBusinesses] = useState<Map<string, BizSchema>>(new Map());

  const limit = DEFAULT_LIMITS.BIZ_FETCH_COUNT;

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/py/businesses_items?skip=${(page - 1) * limit
        }&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: BusinessItemViewIfc[] = await response.json();
      setBusinesses(data);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
      console.error("Error fetching businesses:", err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchBusinesses();
    }
  }, [session, page, limit]);

  const handleFormSubmit = async (formData: AdminFormIfc) => {
    try {
      if (editingId) {
        // Update existing business
        const response = await fetch(
          `${BACKEND_URL}/api/py/businesses/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          const updatedBusiness = await response.json();
          console.log("Business updated:", updatedBusiness);

          // Update the businesses list
          setBusinesses(prevBusinesses =>
            prevBusinesses.map(business =>
              business.ref_id === editingId ? { ...business, ...updatedBusiness } : business
            )
          );

          // Update the expanded businesses
          setExpandedBusinesses(prev => {
            const newMap = new Map(prev);
            if (newMap.has(editingId)) {
              newMap.set(editingId, { ...newMap.get(editingId)!, ...updatedBusiness });
            }
            return newMap;
          });

          setEditingId(null);
          setEditingData(null);
        } else {
          throw new Error("Failed to update business");
        }
      } else {
        // Create new business
        const response = await fetch(`${BACKEND_URL}/api/py/businesses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newBusiness = await response.json();
          console.log("New business created:", newBusiness);
          setShowForm(false);
          setBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);
        } else {
          throw new Error("Failed to create business");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save business. Please check the console for details.");
    }
  };

  const handleEdit = async (ref_id: string) => {
    if (editingId === ref_id) {
      // Cancel editing
      setEditingId(null);
      setEditingData(null);
    } else {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/py/businesses/${ref_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch business data");
        }
        const businessData = await response.json();
        setEditingId(ref_id);
        setEditingData(businessData);
      } catch (error) {
        console.error("Error fetching business data:", error);
        alert("Failed to fetch business data for editing.");
      }
    }
  };

  const handleRowClick = async (ref_id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ref_id)) {
        newSet.delete(ref_id);
      } else {
        newSet.add(ref_id);
      }
      return newSet;
    });

    if (!expandedBusinesses.has(ref_id)) {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/py/businesses/${ref_id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch business details');
        const businessDetails: BizSchema = await res.json();
        setExpandedBusinesses(prev => new Map(prev).set(ref_id, businessDetails));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching business details:", error);
        setError(true);
        setLoading(false);
      }
    }
  };

  const handleDelete = async (ref_id: string) => {
    if (confirm("Are you sure you want to delete this business?")) {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/py/businesses/${ref_id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setBusinesses(
            businesses.filter((business) => business.ref_id !== ref_id)
          );
          // Remove from expanded businesses
          setExpandedBusinesses(prev => {
            const newMap = new Map(prev);
            newMap.delete(ref_id);
            return newMap;
          });
          // Remove from expanded IDs
          setExpandedIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(ref_id);
            return newSet;
          });
        } else {
          throw new Error("Failed to delete business");
        }
      } catch (error) {
        console.error("Error deleting business:", error);
        alert("Failed to delete business. Please try again.");
      }
    }
  };

  if (!session) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center p-5 bg-white rounded-3 shadow-lg">
          <h1 className="mb-4 text-primary">Welcome to Admin Dashboard</h1>
          <p className="mb-4 text-muted">Please sign in to continue</p>
          <button onClick={() => signIn()} className="btn btn-primary btn-lg rounded-pill px-5">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-5 bg-light">
      <div className="row">
        <div className="col-12">
          <div className="card shadow border-0 rounded-3">
            <div className="card-header bg-primary text-white py-3 rounded-top">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 m-0 font-weight-bold">Business Listings</h2>
                <button
                  className={`btn btn-sm rounded-pill ${showForm ? 'btn-danger' : 'btn-light'}`}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? (
                    <>
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>Add New Business
                    </>
                  )}
                </button>
                <button
                  className="btn btn-sm btn-light rounded-pill"
                  onClick={() => signOut()}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                </button>
              </div>
            </div>
            <Link
              href="/admin/livechat"
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                style={{
                  borderRadius: '4px',
                  padding: '8px 16px'
                }}
              >
                <FontAwesomeIcon icon={faComment} />
                Live Chat
              </Button>
            </Link>
            <div className="card-body">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              ) : (
                <>
                  {showForm && (
                    <div className="mb-4">
                      <h3 className="h5 mb-3">Add New Business</h3>
                      <AdminFormComponent
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                        initialData={null}
                      />
                    </div>
                  )}
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Ref ID</th>
                          <th>Title</th>
                          <th>Location</th>
                          <th>Price</th>
                          <th>Turnover</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {businesses.map((business) => (
                          <React.Fragment key={business.ref_id}>
                            <tr onClick={() => handleRowClick(business.ref_id)} className="cursor-pointer">
                              <td><span className="badge bg-secondary">{business.ref_id}</span></td>
                              <td className="text-break">{business.title}</td>
                              <td className="text-break"><i className="bi bi-geo-alt-fill text-muted me-1"></i>{business.location}</td>
                              <td><span className="text-success fw-bold">${business.price.toLocaleString()}</span></td>
                              <td><span className="text-primary">${business.turnover.toLocaleString()}</span></td>
                              <td onClick={(e) => e.stopPropagation()}>
                                <div className="btn-group" role="group">
                                  <button
                                    className={`btn btn-sm ${editingId === business.ref_id ? "btn-secondary" : "btn-outline-primary"
                                      }`}
                                    onClick={() => handleEdit(business.ref_id)}
                                  >
                                    <i className={`bi ${editingId === business.ref_id ? "bi-x" : "bi-pencil"} me-1`}></i>
                                    {editingId === business.ref_id ? "Cancel" : "Edit"}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(business.ref_id)}
                                  >
                                    <i className="bi bi-trash me-1"></i>Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expandedIds.has(business.ref_id) && expandedBusinesses.get(business.ref_id) && !editingId && (
                              <tr>
                                <td colSpan={6} className="p-0">
                                  <div className="bizdetail-wrapper bg-light p-3 border-top">
                                    <BizDetail business={expandedBusinesses.get(business.ref_id)!} />
                                  </div>
                                </td>
                              </tr>
                            )}
                            {editingId === business.ref_id && (
                              <tr>
                                <td colSpan={6} className="p-0">
                                  <div className="bizdetail-wrapper bg-light p-3 border-top">
                                    <AdminFormComponent
                                      onSubmit={handleFormSubmit}
                                      onCancel={() => setEditingId(null)}
                                      initialData={editingData}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <nav aria-label="Business listings pagination" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link rounded-start" onClick={() => setPage(page - 1)} disabled={page === 1}>
                          <i className="bi bi-chevron-left"></i> Previous
                        </button>
                      </li>
                      <li className="page-item active">
                        <span className="page-link">
                          Page {page}
                        </span>
                      </li>
                      <li className="page-item">
                        <button className="page-link rounded-end" onClick={() => setPage(page + 1)}>
                          Next <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
