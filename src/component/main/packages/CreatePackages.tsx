import InputField from "../../core/input/Input";
import type { InputFieldProps } from "../../core/types";
import { Section } from "../../core/section/Section";

import Button from "../../core/button/Button";
import { useState, useEffect } from "react";
import { formatPayload } from "../utils/util";
import { Spinner } from "../../core/spinners/Spinner";
import { useNotification } from "../../../context/Notification";
import { usePackage } from "../../../services/Package/usePackage";
import type { PackageProps } from "../../../services/Package/packages.types";

type BasicInfoField = InputFieldProps & {
  render?: () => void;
};

const Modes = {
  EDIT: "edit",
  ADD: "add",
} as const;

type Modes = (typeof Modes)[keyof typeof Modes];

const CreatePackages = ({
  onSuccess,
  mode = Modes.ADD,
  values,
  setEditId,
}: {
  onSuccess: () => void;
  mode?: Modes;
  values?: PackageProps;
  setEditId?: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const notify = useNotification();
  const { loading, createPackage, updatePackage } = usePackage({
    autoFetch: false,
  });

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

  useEffect(() => {
    if (mode === Modes.EDIT && values) {
      setFormData({
        name: values.name || "",
        numberOfPerson: values.numberOfPerson || "",
        title: values.title || "",
        price: values.price || "",
        description: values.description?.map((d) => d.detail) || [],
        isPopular: values.isPopular || false,
      });
    } else if (mode === Modes.ADD) {
      setFormData({});
    }
  }, [mode, values]);

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
      if (mode === Modes.EDIT && values?._id) {
        await updatePackage({ ...reqParam, id: values._id });
        notify("Package Updated Successfully!", "success");
        setEditId?.(null);
      } else {
        await createPackage(reqParam);
        notify("Package Created Successfully!", "success");
      }
      onSuccess();
    } catch (error: any) {
      const errorKeys = Object.keys(error.response?.data.error?.errors || {});
      errorKeys.forEach((x) => notify(x, "error"));
    }
  };

  return (
    <>
      <div className="sectios-container-pkg">
        <Section>
          <Section.Title>
            {mode === Modes.EDIT ? "Edit Package" : "Add Package Informations"}
            <div className="action-buttons">
              <Button onClick={onSave}>
                {loading && <Spinner color="primary" size="xs" />}
                {mode === Modes.EDIT ? "Update" : "Save"}
              </Button>
            </div>
          </Section.Title>
          <Section.Content>
            <div className="section-child-container-package">
              {packageConfig.basicInfo?.map(
                (pkg: InputFieldProps, idx: number) => {
                  const val = (formData as any)[pkg.name];
                  return (
                    <InputField
                      key={`${pkg.name}-${idx}`}
                      {...pkg}
                      value={pkg.type === "checkbox" ? undefined : val ?? ""}
                      checked={pkg.type === "checkbox" ? !!val : undefined}
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
