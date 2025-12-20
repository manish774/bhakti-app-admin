interface ContactInfoProps {
  contact: {
    phone: string;
    email: string;
  };
  website: string;
  onInputChange: (field: string, value: string, nestedField: string) => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  contact,
  website,
  onInputChange,
}) => {
  return (
    <div className="form-section">
      <h2>Contact Information</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            value={contact.phone}
            onChange={(e) =>
              onInputChange("extraInfo.contact", e.target.value, "phone")
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
            value={contact.email}
            onChange={(e) =>
              onInputChange("extraInfo.contact", e.target.value, "email")
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
          value={website}
          onChange={(e) =>
            onInputChange("extraInfo", e.target.value, "website")
          }
          placeholder="https://www.temple.org"
        />
      </div>
    </div>
  );
};

export default ContactInfo;
