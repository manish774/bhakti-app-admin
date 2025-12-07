import React, { useState, useEffect } from "react";
import Services from "../../services/Services";
import DashboardEventEmitter from "../../services/DashboardEvents";
import type { Temple, Package } from "../../types/api";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [notification, setNotification] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTemple, setEditingTemple] = useState<Temple | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Temple>>({});
  const [editingPackages, setEditingPackages] = useState<Package[]>([]);
  const [newPackages, setNewPackages] = useState<Partial<Package>[]>([]);
  const [deletedPackageIds, setDeletedPackageIds] = useState<string[]>([]);

  const fetchTemples = async () => {
    try {
      setLoading(true);
      const services = Services.getInstance();
      const response = await services.getAllTemples();
      setTemples(response);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch temples");
      console.error("Error fetching temples:", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const refreshData = async () => {
    await fetchTemples();
    showNotification("🔄 Dashboard refreshed successfully!");
  };

  useEffect(() => {
    fetchTemples();

    // Listen for temple updates from other parts of the app
    const eventEmitter = DashboardEventEmitter.getInstance();

    const handleTempleUpdate = () => {
      fetchTemples();
      showNotification("📊 Data updated automatically!");
    };

    eventEmitter.on("templesUpdated", handleTempleUpdate);

    // Set up polling to check for updates every 30 seconds
    const interval = setInterval(() => {
      fetchTemples();
    }, 30000);

    return () => {
      clearInterval(interval);
      eventEmitter.off("templesUpdated", handleTempleUpdate);
    };
  }, []);

  const handleTempleClick = (temple: Temple) => {
    setSelectedTemple(temple);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemple(null);
    setIsEditMode(false);
    setEditingTemple(null);
  };

  const handleEditTemple = (e: React.MouseEvent, temple: Temple) => {
    e.stopPropagation(); // Prevent card click
    setEditingTemple(temple);
    setSelectedTemple(temple);
    setEditFormData({
      name: temple.name,
      location: temple.location,
      pandit: { ...temple.pandit },
      extraInfo: { ...temple.extraInfo },
      prasadDelivery: { ...temple.prasadDelivery },
    });
    setEditingPackages(temple.packages.map((pkg) => ({ ...pkg })));
    setNewPackages([]);
    setDeletedPackageIds([]);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteTemple = async (e: React.MouseEvent, templeId: string) => {
    e.stopPropagation(); // Prevent card click
    setDeleteConfirm(templeId);
  };

  const confirmDelete = async (templeId: string) => {
    try {
      const services = Services.getInstance();
      await services.deleteTemple(templeId);
      showNotification("🗑️ Temple deleted successfully!");
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting temple:", err);
      showNotification("❌ Failed to delete temple");
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedEditChange = (
    parent: string,
    field: string,
    value: string
  ) => {
    setEditFormData((prev) => {
      const updated = { ...prev };
      if (parent === "pandit" && updated.pandit) {
        updated.pandit = {
          ...updated.pandit,
          [field]: value,
        } as typeof updated.pandit;
      } else if (parent === "extraInfo" && updated.extraInfo) {
        updated.extraInfo = {
          ...updated.extraInfo,
          [field]: value,
        } as typeof updated.extraInfo;
      } else if (parent === "prasadDelivery" && updated.prasadDelivery) {
        updated.prasadDelivery = {
          ...updated.prasadDelivery,
          [field]: value,
        } as typeof updated.prasadDelivery;
      }
      return updated;
    });
  };

  const handleEditPackage = (
    index: number,
    field: keyof Package,
    value: string | number | boolean
  ) => {
    setEditingPackages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleEditPackageDescription = (
    packageIndex: number,
    descIndex: number,
    detail: string
  ) => {
    setEditingPackages((prev) => {
      const updated = [...prev];
      const pkg = { ...updated[packageIndex] };
      if (pkg.description) {
        pkg.description = pkg.description.map((desc, idx) =>
          idx === descIndex ? { ...desc, detail } : desc
        );
        updated[packageIndex] = pkg;
      }
      return updated;
    });
  };

  const handleDeletePackage = (index: number) => {
    const pkg = editingPackages[index];
    if (pkg.id) {
      setDeletedPackageIds((prev) => [...prev, pkg.id]);
    }
    setEditingPackages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddNewPackage = () => {
    const newPackage: Partial<Package> = {
      id: `new-${Date.now()}`,
      name: "",
      numberOfPerson: 1,
      title: "",
      price: 0,
      description: [],
      isPopular: false,
    };
    setNewPackages((prev) => [...prev, newPackage]);
  };

  const handleEditNewPackage = (
    index: number,
    field: keyof Package,
    value: string | number | boolean
  ) => {
    setNewPackages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleDeleteNewPackage = (index: number) => {
    setNewPackages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDescriptionToNewPackage = (packageIndex: number) => {
    setNewPackages((prev) => {
      const updated = [...prev];
      const pkg = { ...updated[packageIndex] };
      const nextId =
        (pkg.description?.length ?? 0) > 0
          ? Math.max(...(pkg.description?.map((d) => d.id ?? 0) ?? [0])) + 1
          : 1;
      pkg.description = [
        ...(pkg.description ?? []),
        { id: nextId, detail: "" },
      ];
      updated[packageIndex] = pkg;
      return updated;
    });
  };

  const handleEditNewPackageDescription = (
    packageIndex: number,
    descIndex: number,
    detail: string
  ) => {
    setNewPackages((prev) => {
      const updated = [...prev];
      const pkg = { ...updated[packageIndex] };
      if (pkg.description) {
        pkg.description = pkg.description.map((desc, idx) =>
          idx === descIndex ? { ...desc, detail } : desc
        );
        updated[packageIndex] = pkg;
      }
      return updated;
    });
  };

  const handleDeleteNewPackageDescription = (
    packageIndex: number,
    descIndex: number
  ) => {
    setNewPackages((prev) => {
      const updated = [...prev];
      const pkg = { ...updated[packageIndex] };
      if (pkg.description) {
        pkg.description = pkg.description.filter((_, idx) => idx !== descIndex);
        updated[packageIndex] = pkg;
      }
      return updated;
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTemple || !editFormData) return;

    try {
      const services = Services.getInstance();

      // Prepare the update data with modified packages
      const updateData: Partial<Temple> = {
        ...editFormData,
        packages: editingPackages,
      };

      // Call update API
      await services.updateTemple(editingTemple._id, updateData);

      // Delete packages that were marked for deletion
      if (deletedPackageIds.length > 0) {
        for (const packageId of deletedPackageIds) {
          try {
            await services.deletePackage(editingTemple._id, packageId);
          } catch (err) {
            console.error(`Error deleting package ${packageId}:`, err);
          }
        }
      }

      // Add new packages
      if (newPackages.length > 0) {
        for (const pkg of newPackages) {
          try {
            const packageData = {
              name: pkg.name || "",
              numberOfPerson: pkg.numberOfPerson || 1,
              title: pkg.title || "",
              price: pkg.price || 0,
              description: pkg.description || [],
              isPopular: pkg.isPopular || false,
            };
            await services.addPackage(editingTemple._id, packageData);
          } catch (err) {
            console.error("Error adding new package:", err);
          }
        }
      }

      showNotification("✅ Temple and packages updated successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Error updating temple:", err);
      showNotification("❌ Failed to update temple");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading temples...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      {/* Enhanced Header with Modern Stats */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏛️ Temple Dashboard</h1>
          <p>Manage and view all temple listings with ease</p>
          <div className="dashboard-actions">
            <button
              className="refresh-btn"
              onClick={refreshData}
              disabled={loading}
            >
              {loading ? "🔄 Refreshing..." : "🔄 Refresh Data"}
            </button>
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏛️</div>
            <div className="stat-content">
              <span className="stat-number">{temples.length}</span>
              <span className="stat-label">Total Temples</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-number">
                {temples.reduce(
                  (acc, temple) => acc + temple.packages.length,
                  0
                )}
              </span>
              <span className="stat-label">Total Packages</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-number">
                ₹
                {temples
                  .reduce(
                    (acc, temple) =>
                      acc +
                      temple.packages.reduce((sum, pkg) => sum + pkg.price, 0),
                    0
                  )
                  .toLocaleString()}
              </span>
              <span className="stat-label">Total Value</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Temple Cards Grid */}
      <div className="temples-container">
        {temples.map((temple) => {
          const minPrice = Math.min(...temple.packages.map((pkg) => pkg.price));
          const maxPrice = Math.max(...temple.packages.map((pkg) => pkg.price));
          const popularPackages = temple.packages.filter(
            (pkg) => pkg.isPopular
          ).length;

          return (
            <div
              key={temple._id}
              className="temple-card-small"
              onClick={() => handleTempleClick(temple)}
            >
              <div className="temple-card-header">
                <div className="temple-icon">🏛️</div>
                <div className="temple-basic-info">
                  <h3 className="temple-name-small">{temple.name}</h3>
                  <p className="temple-location-small">📍 {temple.location}</p>
                </div>
                {popularPackages > 0 && (
                  <div className="popular-indicator">{popularPackages} ⭐</div>
                )}
              </div>

              <div className="temple-card-content">
                <div className="temple-summary">
                  <div className="summary-item">
                    <span className="summary-label">Packages</span>
                    <span className="summary-value">
                      {temple.packages.length}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Price Range</span>
                    <span className="summary-value">
                      ₹{minPrice.toLocaleString()} - ₹
                      {maxPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Pandit</span>
                    <span className="summary-value">{temple.pandit.name}</span>
                  </div>
                </div>

                <div className="temple-card-footer">
                  <span className="view-details">Click to view details →</span>
                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => handleEditTemple(e, temple)}
                      title="Edit Temple"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteTemple(e, temple._id)}
                      title="Delete Temple"
                    >
                      🗑️
                    </button>
                  </div>
                  <span className="temple-id">#{temple._id.slice(-6)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Temple Details Modal */}
      {isModalOpen && selectedTemple && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditMode ? "✏️ Edit Temple" : selectedTemple.name}</h2>
              <div className="modal-actions">
                {isEditMode ? (
                  <>
                    <button className="save-btn" onClick={handleSaveEdit}>
                      ✅ Save
                    </button>
                    <button
                      className="cancel-edit-btn"
                      onClick={handleCloseModal}
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <button className="modal-close" onClick={handleCloseModal}>
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="modal-body">
              {/* Temple Details */}
              <div className="modal-section">
                <h3>Temple Information</h3>
                {isEditMode ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label className="form-label">Temple Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editFormData.name || ""}
                        onChange={(e) =>
                          handleEditFormChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editFormData.location || ""}
                        onChange={(e) =>
                          handleEditFormChange("location", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Famous For:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editFormData.extraInfo?.famousFor || ""}
                        onChange={(e) =>
                          handleNestedEditChange(
                            "extraInfo",
                            "famousFor",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Temple Timing:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editFormData.extraInfo?.templeTiming || ""}
                        onChange={(e) =>
                          handleNestedEditChange(
                            "extraInfo",
                            "templeTiming",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pandit Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editFormData.pandit?.name || ""}
                        onChange={(e) =>
                          handleNestedEditChange(
                            "pandit",
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">About Pandit:</label>
                      <textarea
                        className="form-textarea"
                        value={editFormData.pandit?.about || ""}
                        onChange={(e) =>
                          handleNestedEditChange(
                            "pandit",
                            "about",
                            e.target.value
                          )
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="temple-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">
                        {selectedTemple.location}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Famous For:</span>
                      <span className="detail-value">
                        {selectedTemple.extraInfo.famousFor}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Timing:</span>
                      <span className="detail-value">
                        {selectedTemple.extraInfo.templeTiming}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">
                        {selectedTemple.extraInfo.contact.phone}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">
                        {selectedTemple.extraInfo.contact.email}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Website:</span>
                      <a
                        href={selectedTemple.extraInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-link"
                      >
                        {selectedTemple.extraInfo.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Pandit Information */}
              <div className="modal-section">
                <h3>Pandit Information</h3>
                <div className="pandit-info">
                  <p>
                    <strong>{selectedTemple.pandit.name}</strong>
                  </p>
                  <p className="pandit-about">{selectedTemple.pandit.about}</p>
                </div>
              </div>

              {/* Prasad Delivery */}
              <div className="modal-section">
                <h3>Prasad Delivery</h3>
                <div className="prasad-info">
                  <p>
                    <strong>Available:</strong>{" "}
                    {selectedTemple.prasadDelivery.included ? "Yes" : "No"}
                  </p>
                  {selectedTemple.prasadDelivery.included && (
                    <>
                      <p>
                        <strong>Delivery Time:</strong>{" "}
                        {selectedTemple.prasadDelivery.deliveryTime}
                      </p>
                      <p>
                        <strong>Charge:</strong> ₹
                        {selectedTemple.prasadDelivery.prasadCharge}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Packages */}
              <div className="modal-section">
                <h3>
                  Available Packages (
                  {isEditMode
                    ? editingPackages.length + newPackages.length
                    : selectedTemple.packages.length}
                  )
                </h3>

                {isEditMode ? (
                  <div className="edit-packages-section">
                    {/* Existing Packages */}
                    {editingPackages.length > 0 && (
                      <div className="existing-packages">
                        <h4>Existing Packages</h4>
                        {editingPackages.map((pkg, index) => (
                          <div key={pkg.id} className="edit-package-form">
                            <div className="edit-package-header">
                              <span className="package-index">
                                Package {index + 1}
                              </span>
                              <button
                                className="delete-package-btn"
                                onClick={() => handleDeletePackage(index)}
                              >
                                🗑️ Delete
                              </button>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                Package Name:
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                value={pkg.name || ""}
                                onChange={(e) =>
                                  handleEditPackage(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Title:</label>
                              <input
                                type="text"
                                className="form-input"
                                value={pkg.title || ""}
                                onChange={(e) =>
                                  handleEditPackage(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label className="form-label">Price:</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={pkg.price || 0}
                                  onChange={(e) =>
                                    handleEditPackage(
                                      index,
                                      "price",
                                      parseFloat(e.target.value)
                                    )
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">
                                  Number of Persons:
                                </label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={pkg.numberOfPerson || 1}
                                  onChange={(e) =>
                                    handleEditPackage(
                                      index,
                                      "numberOfPerson",
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                <input
                                  type="checkbox"
                                  checked={pkg.isPopular || false}
                                  onChange={(e) =>
                                    handleEditPackage(
                                      index,
                                      "isPopular",
                                      e.target.checked
                                    )
                                  }
                                />
                                Mark as Popular
                              </label>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                Descriptions:
                              </label>
                              <div className="descriptions-list">
                                {pkg.description &&
                                pkg.description.length > 0 ? (
                                  pkg.description.map((desc, descIndex) => (
                                    <div
                                      key={desc.id}
                                      className="description-item"
                                    >
                                      <input
                                        type="text"
                                        className="form-input"
                                        value={desc.detail || ""}
                                        onChange={(e) =>
                                          handleEditPackageDescription(
                                            index,
                                            descIndex,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Feature description"
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <p className="no-descriptions">
                                    No descriptions added
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Packages */}
                    {newPackages.length > 0 && (
                      <div className="new-packages">
                        <h4>New Packages</h4>
                        {newPackages.map((pkg, index) => (
                          <div
                            key={pkg.id}
                            className="edit-package-form new-package"
                          >
                            <div className="edit-package-header">
                              <span className="package-index">
                                New Package {index + 1}
                              </span>
                              <button
                                className="delete-package-btn"
                                onClick={() => handleDeleteNewPackage(index)}
                              >
                                🗑️ Delete
                              </button>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                Package Name:
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                value={pkg.name || ""}
                                onChange={(e) =>
                                  handleEditNewPackage(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Title:</label>
                              <input
                                type="text"
                                className="form-input"
                                value={pkg.title || ""}
                                onChange={(e) =>
                                  handleEditNewPackage(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label className="form-label">Price:</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={pkg.price || 0}
                                  onChange={(e) =>
                                    handleEditNewPackage(
                                      index,
                                      "price",
                                      parseFloat(e.target.value)
                                    )
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">
                                  Number of Persons:
                                </label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={pkg.numberOfPerson || 1}
                                  onChange={(e) =>
                                    handleEditNewPackage(
                                      index,
                                      "numberOfPerson",
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                <input
                                  type="checkbox"
                                  checked={pkg.isPopular || false}
                                  onChange={(e) =>
                                    handleEditNewPackage(
                                      index,
                                      "isPopular",
                                      e.target.checked
                                    )
                                  }
                                />
                                Mark as Popular
                              </label>
                            </div>

                            <div className="form-group">
                              <label className="form-label">
                                Descriptions:
                              </label>
                              <div className="descriptions-list">
                                {pkg.description &&
                                pkg.description.length > 0 ? (
                                  pkg.description.map((desc, descIndex) => (
                                    <div
                                      key={desc.id}
                                      className="description-item"
                                    >
                                      <input
                                        type="text"
                                        className="form-input"
                                        value={desc.detail || ""}
                                        onChange={(e) =>
                                          handleEditNewPackageDescription(
                                            index,
                                            descIndex,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Feature description"
                                      />
                                      <button
                                        className="delete-desc-btn"
                                        onClick={() =>
                                          handleDeleteNewPackageDescription(
                                            index,
                                            descIndex
                                          )
                                        }
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="no-descriptions">
                                    No descriptions added
                                  </p>
                                )}
                              </div>
                              <button
                                className="add-desc-btn"
                                onClick={() =>
                                  handleAddDescriptionToNewPackage(index)
                                }
                              >
                                + Add Description
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Package Button */}
                    <button
                      className="add-package-btn"
                      onClick={handleAddNewPackage}
                    >
                      + Add New Package
                    </button>
                  </div>
                ) : (
                  <div className="modal-packages-grid">
                    {selectedTemple.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`modal-package-card ${
                          pkg.isPopular ? "popular" : ""
                        }`}
                      >
                        <div className="modal-package-header">
                          <h4>{pkg.name}</h4>
                          {pkg.isPopular && (
                            <span className="popular-badge">Popular</span>
                          )}
                        </div>
                        <p className="modal-package-title">{pkg.title}</p>
                        <div className="modal-package-pricing">
                          <span className="modal-price">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          <span className="modal-persons">
                            {pkg.numberOfPerson} person
                            {pkg.numberOfPerson > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="modal-package-features">
                          {pkg.description.map((desc) => (
                            <div key={desc.id} className="modal-feature-item">
                              <span className="modal-feature-icon">✓</span>
                              <span>{desc.detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header delete-header">
              <h2>🗑️ Delete Temple</h2>
              <button className="modal-close" onClick={cancelDelete}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to delete this temple? This action cannot
                be undone.
              </p>
              <div className="delete-actions">
                <button className="cancel-btn" onClick={cancelDelete}>
                  Cancel
                </button>
                <button
                  className="confirm-delete-btn"
                  onClick={() => confirmDelete(deleteConfirm)}
                >
                  Delete Temple
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
