import InputField from "../../core/input/Input";
import type { InputFieldProps } from "../../core/types";
import { Section } from "../../core/section/Section";

import Button from "../../core/button/Button";
import { useState } from "react";
import { formatPayload } from "../utils/util";
import { Spinner } from "../../core/spinners/Spinner";
import { useNotification } from "../../../context/Notification";
import { usePackage } from "../../../services/Package/usePackage";

type BasicInfoField = InputFieldProps & {
  render?: () => void;
};

const CreatePackages = () => {
  const notify = useNotification();
  const { loading, createPackage } = usePackage({ autoFetch: false });
  const packageConfig: {
    basicInfo: BasicInfoField[];
  } = {
    basicInfo: [
      {
        label: "Package Name",
        type: "text",
        name: "name",
        required: true,
      },
      {
        label: "Number of persons",
        type: "number",
        name: "numberOfPerson",
        required: true,
      },
      {
        label: "Title",
        type: "text",
        name: "title",
      },
      {
        label: "Price",
        type: "number",
        name: "price",
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        numberOfFields: 10,
      },
      {
        label: "Is popular",
        type: "checkbox",
        name: "isPopular",
      },
    ],
  };

  const [formData, setFormData] = useState<Record<string, any>>({});

  const formatValue = (name: string, value: any) => {
    if (name === "description") {
      return value?.map((x, i) => ({ id: i, detail: x }));
    }
    return value;
  };
  // Enhanced handleOnChange to handle both single values and arrays
  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pkg: InputFieldProps
  ) => {
    const isMultiple = pkg.numberOfFields > 0;
    if (!e.target?.name) return;

    const { name, value, type } = e.target;

    // Handle checkbox separately
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (isMultiple) {
      setFormData((prev) => {
        const currentArray = Array.isArray(prev[name]) ? [...prev[name]] : [];
        currentArray[parseInt(e.target.getAttribute("aria-index"))] = value;
        return { ...prev, [name]: formatValue(pkg.name, currentArray) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSave = async () => {
    try {
      const reqParam = formatPayload.call(formData);
      await createPackage(reqParam);
      notify("Package Created Successfully!", "success");
    } catch (error: any) {
      const errorKeys = Object.keys(error.response?.data.error?.errors || {});
      errorKeys.forEach((x) => notify(x, "error"));
    }
  };

  return (
    <>
      <div className="action-buttons">
        <Button onClick={onSave}>
          {loading && <Spinner color="primary" size="xs" />}
          Save
        </Button>
      </div>
      <div className="sectios-container">
        <Section>
          <Section.Title>Add Package Informations</Section.Title>
          <Section.Content>
            <div className="section-child-container">
              {packageConfig.basicInfo?.map(
                (pkg: InputFieldProps, idx: number) => {
                  return (
                    <InputField
                      key={`${pkg.name}-${idx}`}
                      {...pkg}
                      onChange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => handleOnChange(e, pkg)}
                    />
                  );
                }
              )}
            </div>
          </Section.Content>
        </Section>
      </div>
    </>
  );
};

export default CreatePackages;
