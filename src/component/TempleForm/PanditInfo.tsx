import React from "react";

interface PanditInfoProps {
  pandit: {
    name: string;
    about: string;
  };
  onInputChange: (field: string, value: string, nestedField: string) => void;
}

const PanditInfo: React.FC<PanditInfoProps> = ({ pandit, onInputChange }) => {
  return (
    <div className="form-section">
      <h2>Pandit Information</h2>
      <div className="form-group">
        <label htmlFor="panditName">Pandit Name *</label>
        <input
          type="text"
          id="panditName"
          value={pandit.name}
          onChange={(e) => onInputChange("pandit", e.target.value, "name")}
          required
          placeholder="Enter pandit name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="panditAbout">About Pandit *</label>
        <textarea
          id="panditAbout"
          value={pandit.about}
          onChange={(e) => onInputChange("pandit", e.target.value, "about")}
          required
          placeholder="Describe the pandit's experience and background"
          rows={3}
        />
      </div>
    </div>
  );
};

export default PanditInfo;
