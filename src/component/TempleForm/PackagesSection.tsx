import React from "react";
import type { Package, PackageDescription } from "../../types/api";

interface PackagesSectionProps {
  packages: Package[];
  onUpdate: (packages: Package[]) => void;
}

const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  onUpdate,
}) => {
  const addPackage = () => {
    const newPackage: Package = {
      id: `pkg${packages.length + 1}`,
      name: "",
      numberOfPerson: 1,
      title: "",
      price: 0,
      description: [{ id: 1, detail: "" }],
      isPopular: false,
    };
    onUpdate([...packages, newPackage]);
  };

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      onUpdate(packages.filter((_, i) => i !== index));
    }
  };

  const updatePackage = (
    index: number,
    field: keyof Package,
    value: string | number | boolean
  ) => {
    const newPackages = [...packages];
    (newPackages[index] as any)[field] = value;
    onUpdate(newPackages);
  };

  const addPackageDescription = (packageIndex: number) => {
    const newPackages = [...packages];
    const newDescription: PackageDescription = {
      id: newPackages[packageIndex].description.length + 1,
      detail: "",
    };
    newPackages[packageIndex].description.push(newDescription);
    onUpdate(newPackages);
  };

  const removePackageDescription = (
    packageIndex: number,
    descIndex: number
  ) => {
    if (packages[packageIndex].description.length > 1) {
      const newPackages = [...packages];
      newPackages[packageIndex].description = newPackages[
        packageIndex
      ].description.filter((_, i) => i !== descIndex);
      onUpdate(newPackages);
    }
  };

  const updatePackageDescription = (
    packageIndex: number,
    descIndex: number,
    value: string
  ) => {
    const newPackages = [...packages];
    newPackages[packageIndex].description[descIndex].detail = value;
    onUpdate(newPackages);
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <h2>Packages ({packages.length})</h2>
        <button type="button" onClick={addPackage} className="add-button">
          + Add Package
        </button>
      </div>

      {packages.map((pkg, packageIndex) => (
        <div key={pkg.id} className="package-form">
          <div className="package-header">
            <h3>Package {packageIndex + 1}</h3>
            {packages.length > 1 && (
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
                  updatePackage(packageIndex, "name", e.target.value)
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
                  updatePackage(packageIndex, "title", e.target.value)
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
                  updatePackage(packageIndex, "price", Number(e.target.value))
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
                  updatePackage(
                    packageIndex,
                    "numberOfPerson",
                    Number(e.target.value)
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
                  updatePackage(packageIndex, "isPopular", e.target.checked)
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
  );
};

export default PackagesSection;
