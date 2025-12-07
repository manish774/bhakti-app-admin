import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import type { Package, PackageDescription } from "../../types/api";
import "./TempleForm.css";

interface TempleFormData {
  name: string;
  location: string;
  image: string;
  description: string[];
  packages: Package[];
  prasadDelivery: {
    included: boolean;
    deliveryTime: string;
    prasadCharge: number;
  };
  pandit: {
    name: string;
    about: string;
  };
  extraInfo: {
    templeTiming: string;
    famousFor: string;
    contact: {
      phone: string;
      email: string;
    };
    website: string;
  };
}

const TempleForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TempleFormData>({
    name: "",
    location: "",
    image: "",
    description: [""],
    packages: [
      {
        id: "pkg1",
        name: "",
        numberOfPerson: 1,
        title: "",
        price: 0,
        description: [{ id: 1, detail: "" }],
        isPopular: false,
      },
    ],
    prasadDelivery: {
      included: true,
      deliveryTime: "",
      prasadCharge: 0,
    },
    pandit: {
      name: "",
      about: "",
    },
    extraInfo: {
      templeTiming: "",
      famousFor: "",
      contact: {
        phone: "",
        email: "",
      },
      website: "",
    },
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean,
    nestedField?: string,
    index?: number
  ) => {
    setFormData((prev) => {
      if (nestedField && index !== undefined) {
        // Handle nested array updates (packages)
        const newData = { ...prev };
        const fieldData = (newData as Record<string, unknown>)[field] as Array<
          Record<string, unknown>
        >;
        fieldData[index][nestedField] = value;
        return newData;
      } else if (nestedField) {
        // Handle nested object updates
        const keys = field.split(".");
        const newData = { ...prev };
        let current = newData as Record<string, unknown>;

        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] as Record<string, unknown>;
        }
        const lastKey = keys[keys.length - 1];
        current[lastKey] = {
          ...(current[lastKey] as Record<string, unknown>),
          [nestedField]: value,
        };
        return newData;
      } else {
        // Handle simple field updates
        return { ...prev, [field]: value };
      }
    });
  };

  const addPackage = () => {
    const newPackage: Package = {
      id: `pkg${formData.packages.length + 1}`,
      name: "",
      numberOfPerson: 1,
      title: "",
      price: 0,
      description: [{ id: 1, detail: "" }],
      isPopular: false,
    };
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, newPackage],
    }));
  };

  const removePackage = (index: number) => {
    if (formData.packages.length > 1) {
      setFormData((prev) => ({
        ...prev,
        packages: prev.packages.filter((_, i) => i !== index),
      }));
    }
  };

  const addPackageDescription = (packageIndex: number) => {
    setFormData((prev) => {
      const newPackages = [...prev.packages];
      const newDescription: PackageDescription = {
        id: newPackages[packageIndex].description.length + 1,
        detail: "",
      };
      newPackages[packageIndex].description.push(newDescription);
      return { ...prev, packages: newPackages };
    });
  };

  const removePackageDescription = (
    packageIndex: number,
    descIndex: number
  ) => {
    if (formData.packages[packageIndex].description.length > 1) {
      setFormData((prev) => {
        const newPackages = [...prev.packages];
        newPackages[packageIndex].description = newPackages[
          packageIndex
        ].description.filter((_, i) => i !== descIndex);
        return { ...prev, packages: newPackages };
      });
    }
  };

  const updatePackageDescription = (
    packageIndex: number,
    descIndex: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newPackages = [...prev.packages];
      newPackages[packageIndex].description[descIndex].detail = value;
      return { ...prev, packages: newPackages };
    });
  };

  const addTemplateDescription = () => {
    setFormData((prev) => ({
      ...prev,
      description: [...prev.description, ""],
    }));
  };

  const removeTempleDescription = (index: number) => {
    if (formData.description.length > 1) {
      setFormData((prev) => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== index),
      }));
    }
  };

  const updateTempleDescription = (index: number, value: string) => {
    setFormData((prev) => {
      const newDescription = [...prev.description];
      newDescription[index] = value;
      return { ...prev, description: newDescription };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const services = Services.getInstance();
      await services.addTemple(formData);
      navigate("/home");
    } catch (err) {
      setError("Failed to add temple. Please try again.");
      console.error("Error adding temple:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-temple-container">
      <div className="add-temple-header">
        <h1>Add New Temple</h1>
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="back-button"
        >
          ← Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="temple-form">
        {error && <div className="error-message">{error}</div>}

        {/* Basic Temple Information */}
        <div className="form-section">
          <h2>Temple Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Temple Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="Enter temple name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image">Image Filename</label>
              <input
                type="text"
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="temple-image.jpg"
              />
            </div>
            <div className="form-group">
              <label htmlFor="famousFor">Famous For *</label>
              <input
                type="text"
                id="famousFor"
                value={formData.extraInfo.famousFor}
                onChange={(e) =>
                  handleInputChange("extraInfo", e.target.value, "famousFor")
                }
                required
                placeholder="What is this temple famous for?"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="templeTiming">Temple Timing *</label>
            <input
              type="text"
              id="templeTiming"
              value={formData.extraInfo.templeTiming}
              onChange={(e) =>
                handleInputChange("extraInfo", e.target.value, "templeTiming")
              }
              required
              placeholder="e.g., 4:00 AM - 11:00 PM"
            />
          </div>

          <div className="description-section">
            <div className="section-header">
              <label>Temple Description</label>
              <button
                type="button"
                onClick={addTemplateDescription}
                className="add-button small"
              >
                + Add Description
              </button>
            </div>

            {formData.description.map((desc, descIndex) => (
              <div key={descIndex} className="description-item">
                <textarea
                  value={desc}
                  onChange={(e) =>
                    updateTempleDescription(descIndex, e.target.value)
                  }
                  placeholder="Enter temple description point"
                  rows={2}
                />
                {formData.description.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTempleDescription(descIndex)}
                    className="remove-button small"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pandit Information */}
        <div className="form-section">
          <h2>Pandit Information</h2>
          <div className="form-group">
            <label htmlFor="panditName">Pandit Name *</label>
            <input
              type="text"
              id="panditName"
              value={formData.pandit.name}
              onChange={(e) =>
                handleInputChange("pandit", e.target.value, "name")
              }
              required
              placeholder="Enter pandit name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="panditAbout">About Pandit *</label>
            <textarea
              id="panditAbout"
              value={formData.pandit.about}
              onChange={(e) =>
                handleInputChange("pandit", e.target.value, "about")
              }
              required
              placeholder="Describe the pandit's experience and background"
              rows={3}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h2>Contact Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                value={formData.extraInfo.contact.phone}
                onChange={(e) =>
                  handleInputChange(
                    "extraInfo.contact",
                    e.target.value,
                    "phone"
                  )
                }
                required
                placeholder="+91 9876543210"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={formData.extraInfo.contact.email}
                onChange={(e) =>
                  handleInputChange(
                    "extraInfo.contact",
                    e.target.value,
                    "email"
                  )
                }
                required
                placeholder="info@temple.org"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              value={formData.extraInfo.website}
              onChange={(e) =>
                handleInputChange("extraInfo", e.target.value, "website")
              }
              placeholder="https://www.temple.org"
            />
          </div>
        </div>

        {/* Prasad Delivery */}
        <div className="form-section">
          <h2>Prasad Delivery</h2>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.prasadDelivery.included}
                onChange={(e) =>
                  handleInputChange(
                    "prasadDelivery",
                    e.target.checked,
                    "included"
                  )
                }
              />
              Prasad Delivery Available
            </label>
          </div>
          {formData.prasadDelivery.included && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deliveryTime">Delivery Time</label>
                <input
                  type="text"
                  id="deliveryTime"
                  value={formData.prasadDelivery.deliveryTime}
                  onChange={(e) =>
                    handleInputChange(
                      "prasadDelivery",
                      e.target.value,
                      "deliveryTime"
                    )
                  }
                  placeholder="Within 7 days after puja"
                />
              </div>
              <div className="form-group">
                <label htmlFor="prasadCharge">Prasad Charge (₹)</label>
                <input
                  type="number"
                  id="prasadCharge"
                  value={formData.prasadDelivery.prasadCharge || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "prasadDelivery",
                      Number(e.target.value),
                      "prasadCharge"
                    )
                  }
                  placeholder="200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Packages */}
        <div className="form-section">
          <div className="section-header">
            <h2>Packages ({formData.packages.length})</h2>
            <button type="button" onClick={addPackage} className="add-button">
              + Add Package
            </button>
          </div>

          {formData.packages.map((pkg, packageIndex) => (
            <div key={pkg.id} className="package-form">
              <div className="package-header">
                <h3>Package {packageIndex + 1}</h3>
                {formData.packages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePackage(packageIndex)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Package Name *</label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        e.target.value,
                        "name",
                        packageIndex
                      )
                    }
                    required
                    placeholder="Single Devotee Puja"
                  />
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={pkg.title}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        e.target.value,
                        "title",
                        packageIndex
                      )
                    }
                    required
                    placeholder="Puja for individual blessings"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={pkg.price || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        Number(e.target.value),
                        "price",
                        packageIndex
                      )
                    }
                    required
                    placeholder="1500"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Persons *</label>
                  <input
                    type="number"
                    value={pkg.numberOfPerson || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        Number(e.target.value),
                        "numberOfPerson",
                        packageIndex
                      )
                    }
                    required
                    min="1"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={pkg.isPopular}
                    onChange={(e) =>
                      handleInputChange(
                        "packages",
                        e.target.checked,
                        "isPopular",
                        packageIndex
                      )
                    }
                  />
                  Mark as Popular Package
                </label>
              </div>

              <div className="description-section">
                <div className="section-header">
                  <label>Package Description</label>
                  <button
                    type="button"
                    onClick={() => addPackageDescription(packageIndex)}
                    className="add-button small"
                  >
                    + Add Detail
                  </button>
                </div>

                {pkg.description.map((desc, descIndex) => (
                  <div key={desc.id} className="description-item">
                    <input
                      type="text"
                      value={desc.detail}
                      onChange={(e) =>
                        updatePackageDescription(
                          packageIndex,
                          descIndex,
                          e.target.value
                        )
                      }
                      placeholder="Enter package detail"
                      required
                    />
                    {pkg.description.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removePackageDescription(packageIndex, descIndex)
                        }
                        className="remove-button small"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Adding Temple..." : "Add Temple"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TempleForm;
