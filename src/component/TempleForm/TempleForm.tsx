import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import type { Package } from "../../types/api";
import ImageUpload from "./ImageUpload";
import BasicInfo from "./BasicInfo";
import PanditInfo from "./PanditInfo";
import ContactInfo from "./ContactInfo";
import PrasadDelivery from "./PrasadDelivery";
import PackagesSection from "./PackagesSection";
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

const initialFormData: TempleFormData = {
  name: "",
  location: "",
  image:
    "data:image/jpeg;base64,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",
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
};

const TempleForm: React.FC = () => {
  const navigate = useNavigate();
  const services = Services.getInstance();

  const [formData, setFormData] = useState<TempleFormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: string,
    value: string | number | boolean,
    nestedField?: string
  ) => {
    setFormData((prev) => {
      if (nestedField) {
        const keys = field.split(".");
        const updated = { ...prev };

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        let current: any = updated;

        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }

        const lastKey = keys[keys.length - 1];
        current[lastKey] = {
          ...current[lastKey],
          [nestedField]: value,
        };

        return updated;
      }

      return { ...prev, [field]: value };
    });
  };

  const updateDescription = (description: string[]) => {
    setFormData((prev) => ({ ...prev, description }));
  };

  const updatePackages = (packages: Package[]) => {
    setFormData((prev) => ({ ...prev, packages }));
  };

  const updatePrasadDelivery = (
    prasadDelivery: TempleFormData["prasadDelivery"]
  ) => {
    setFormData((prev) => ({ ...prev, prasadDelivery }));
  };

  const validateForm = (): boolean => {
    if (!selectedImage) {
      setError("Please select temple image");
      return false;
    }
    if (!formData.name || !formData.location) {
      setError("Temple name and location are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1️⃣ Save temple WITHOUT image
      const templeResponse = await services.addTemple({
        ...formData,
        image: "",
      });

      const imageUploadRes = await services.addImage(selectedImage!);

      console.log(templeResponse, imageUploadRes);
      //@ts-expect-error : ignore for now
      await services.updateTemple(templeResponse?.data.data?._id, {
        image: imageUploadRes.filename,
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Failed to add temple. Please try again.");
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

        {/* IMAGE */}
        <ImageUpload onFileSelect={setSelectedImage} />

        <BasicInfo
          formData={{
            name: formData.name,
            location: formData.location,
            famousFor: formData.extraInfo.famousFor,
            templeTiming: formData.extraInfo.templeTiming,
            description: formData.description,
          }}
          onInputChange={handleInputChange}
          onDescriptionChange={updateDescription}
        />

        <PanditInfo
          pandit={formData.pandit}
          onInputChange={handleInputChange}
        />

        <ContactInfo
          contact={formData.extraInfo.contact}
          website={formData.extraInfo.website}
          onInputChange={handleInputChange}
        />

        <PrasadDelivery
          prasadDelivery={formData.prasadDelivery}
          onUpdate={updatePrasadDelivery}
        />

        <PackagesSection
          packages={formData.packages}
          onUpdate={updatePackages}
        />

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Adding Temple..." : "Add Temple"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TempleForm;
