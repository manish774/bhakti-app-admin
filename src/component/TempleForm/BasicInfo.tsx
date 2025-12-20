import React from "react";

interface BasicInfoProps {
  formData: {
    name: string;
    location: string;
    famousFor: string;
    templeTiming: string;
    description: string[];
  };
  onInputChange: (field: string, value: string, nestedField?: string) => void;
  onDescriptionChange: (descriptions: string[]) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  formData,
  onInputChange,
  onDescriptionChange,
}) => {
  const addDescription = () => {
    onDescriptionChange([...formData.description, ""]);
  };

  const removeDescription = (index: number) => {
    if (formData.description.length > 1) {
      onDescriptionChange(formData.description.filter((_, i) => i !== index));
    }
  };

  const updateDescription = (index: number, value: string) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    onDescriptionChange(newDescription);
  };

  return (
    <div className="form-section">
      <h2>Temple Information</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Temple Name *</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
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
            onChange={(e) => onInputChange("location", e.target.value)}
            required
            placeholder="City, State"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="famousFor">Famous For *</label>
          <input
            type="text"
            id="famousFor"
            value={formData.famousFor}
            onChange={(e) =>
              onInputChange("extraInfo", e.target.value, "famousFor")
            }
            required
            placeholder="What is this temple famous for?"
          />
        </div>
        <div className="form-group">
          <label htmlFor="templeTiming">Temple Timing *</label>
          <input
            type="text"
            id="templeTiming"
            value={formData.templeTiming}
            onChange={(e) =>
              onInputChange("extraInfo", e.target.value, "templeTiming")
            }
            required
            placeholder="e.g., 4:00 AM - 11:00 PM"
          />
        </div>
      </div>

      <div className="description-section">
        <div className="section-header">
          <label>Temple Description</label>
          <button
            type="button"
            onClick={addDescription}
            className="add-button small"
          >
            + Add Description
          </button>
        </div>

        {formData.description.map((desc, index) => (
          <div key={index} className="description-item">
            <textarea
              value={desc}
              onChange={(e) => updateDescription(index, e.target.value)}
              placeholder="Enter temple description point"
              rows={2}
            />
            {formData.description.length > 1 && (
              <button
                type="button"
                onClick={() => removeDescription(index)}
                className="remove-button small"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicInfo;
