import InputField from "../../core/input/Input";
import type { InputFieldProps } from "../../core/types";
import { Section } from "../../core/section/Section";
import "./CreateTemple.css";
import Button from "../../core/button/Button";
import { useState } from "react";
import Services from "../../../services/Services";
import { formatPayload } from "../utils/util";
import { Spinner } from "../../core/spinners/Spinner";
import { useNotification } from "../../../context/Notification";

type BasicInfoField = InputFieldProps & {
  render?: () => void; // or `visible`, `show`, `enabled`
};

const CreateTemple = () => {
  const service = Services.getInstance();
  const [isLoading, setLoading] = useState<boolean>();
  const notify = useNotification();

  const templeInputConfig: {
    basicInfo: BasicInfoField[];
    contractorInfo: InputFieldProps[];
  } = {
    basicInfo: [
      {
        label: "Temple Name",
        type: "text",
        name: "name",
        required: true,
        defaultValue: "test",
      },
      {
        label: "Address Line 1",
        type: "text",
        name: "location.addressLine1",
        required: true,
        defaultValue: "test",
      },
      {
        label: "Landmark",
        type: "text",
        name: "location.landmark",
        defaultValue: "test",
      },
      {
        label: "City",
        type: "text",
        name: "location.city",
        defaultValue: "test",
      },
      {
        label: "State",
        type: "text",
        name: "location.state",
        defaultValue: "test",
      },
      {
        label: "Country",
        type: "text",
        name: "location.country",
        defaultValue: "test",
      },
      {
        label: "Pin Code",
        type: "text",
        name: "location.pinCode",
        defaultValue: "111111",
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        defaultValue: "test",
      },
      {
        label: "Photos - for carousal",
        type: "file",
        name: "images",
      },
    ],
    contractorInfo: [
      {
        label: "Contractor Name",
        type: "text",
        name: "contractorInfo.name",
        defaultValue: "test",
      },
      {
        label: "Contractor Phone",
        type: "text",
        name: "contractorInfo.phone",
        defaultValue: "111111111",
      },
      {
        label: "Contractor Address Line 1",
        type: "text",
        name: "contractorInfo.address.addressLine1",
        defaultValue: "test",
      },
      {
        label: "Contractor Landmark",
        type: "text",
        name: "contractorInfo.address.landmark",
        defaultValue: "test",
      },
      {
        label: "Contractor City",
        type: "text",
        name: "contractorInfo.address.city",
        defaultValue: "test",
      },
      {
        label: "Contractor State",
        type: "text",
        name: "contractorInfo.address.state",
        defaultValue: "test",
      },
      {
        label: "Contractor Country",
        type: "text",
        name: "contractorInfo.address.country",
        defaultValue: "test",
      },
      {
        label: "Contractor Pin Code",
        type: "text",
        name: "contractorInfo.address.pinCode",
        defaultValue: "111111",
      },
    ],
  };

  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Array.isArray(e)) {
      setFormData((prev) => ({ ...prev, ["images"]: e }));
    }
    if (e.target?.name) {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const onSave = async () => {
    try {
      setLoading(true);
      const reqParam = formatPayload.call(formData);
      await service.addTemple(reqParam);
      notify("Temple Created Succesfully!", "success");
    } catch (error) {
      const errorKeys = Object.keys(error.response?.data.error?.errors);
      [...errorKeys, "kjg"].map((x) => notify(x, "error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="action-buttons">
        <Button onClick={onSave}>
          {isLoading && <Spinner color="primary" size="xs" />}
          Save
        </Button>
      </div>
      <div className="sectios-container">
        <Section>
          <Section.Title>Basic Info</Section.Title>
          <Section.Content>
            <div className="section-child-container">
              {templeInputConfig.basicInfo?.map((temple: InputFieldProps) => {
                return <InputField {...temple} onChange={handleOnChange} />;
              })}
            </div>
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>Contractor Info</Section.Title>
          <Section.Content>
            <div className="section-child-container">
              {templeInputConfig.contractorInfo?.map(
                (temple: InputFieldProps) => {
                  return <InputField {...temple} onChange={handleOnChange} />;
                }
              )}
            </div>
          </Section.Content>
        </Section>
      </div>
    </div>
  );
};

export default CreateTemple;
