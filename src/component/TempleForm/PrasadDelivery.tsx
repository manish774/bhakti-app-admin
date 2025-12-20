interface PrasadDeliveryProps {
  prasadDelivery: {
    included: boolean;
    deliveryTime: string;
    prasadCharge: number;
  };
  onUpdate: (prasadDelivery: PrasadDeliveryProps["prasadDelivery"]) => void;
}

export const PrasadDelivery: React.FC<PrasadDeliveryProps> = ({
  prasadDelivery,
  onUpdate,
}) => {
  const handleChange = (
    field: keyof PrasadDeliveryProps["prasadDelivery"],
    value: string | number | boolean
  ) => {
    onUpdate({
      ...prasadDelivery,
      [field]: value,
    });
  };

  return (
    <div className="form-section">
      <h2>Prasad Delivery</h2>
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={prasadDelivery.included}
            onChange={(e) => handleChange("included", e.target.checked)}
          />
          Prasad Delivery Available
        </label>
      </div>
      {prasadDelivery.included && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deliveryTime">Delivery Time</label>
            <input
              type="text"
              id="deliveryTime"
              value={prasadDelivery.deliveryTime}
              onChange={(e) => handleChange("deliveryTime", e.target.value)}
              placeholder="Within 7 days after puja"
            />
          </div>
          <div className="form-group">
            <label htmlFor="prasadCharge">Prasad Charge (₹)</label>
            <input
              type="number"
              id="prasadCharge"
              value={prasadDelivery.prasadCharge || ""}
              onChange={(e) =>
                handleChange("prasadCharge", Number(e.target.value))
              }
              placeholder="200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrasadDelivery;
