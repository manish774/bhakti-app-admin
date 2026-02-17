import { useEffect, useState } from "react";
import type { InputFieldProps } from "../../core/types";
import InputField from "../../core/input/Input";
import { Section } from "../../core/section/Section";
import Button from "../../core/button/Button";
import type { IPandit } from "../../../services/pandit/pandit.types";
import { usePandit } from "../../../services/pandit/usePandit";
import { formatPayload } from "../utils/util";
import Spinner from "../../core/spinners/Spinner";

type BasicInfoField = InputFieldProps & {
  render?: () => void;
};

const Modes = {
  EDIT: "edit",
  ADD: "add",
} as const;
type Modes = (typeof Modes)[keyof typeof Modes];

const CreatePandit = ({
  onSuccess,
  mode = Modes.ADD,
  values,
  setEditId,
}: {
  onSuccess: () => void;
  mode?: Modes;
  values?: IPandit;
  setEditId?: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { loading, createPandit } = usePandit({ autoFetch: false });
  const [formData, setFormData] = useState<Record<string, any>>({});

  console.log(onSuccess, setEditId);
  const packageConfig: {
    basicInfo: BasicInfoField[];
  } = {
    basicInfo: [
      {
        label: "Name",
        type: "text",
        name: "name",
        required: true,
        value: formData?.name || "",
      },
      {
        label: "About",
        type: "text",
        name: "about",
        required: true,
        value: formData?.about || "",
      },
      {
        label: "Address",
        type: "text",
        name: "address",
        required: true,
        value: formData?.address || "",
      },
      {
        label: "Email",
        type: "text",
        name: "email",
        required: true,
        value: formData?.email || "",
      },
      {
        label: "Phone",
        type: "number",
        name: "phone",
        required: true,
        value: formData?.phone || "",
      },
      {
        label: "ExtraInfo",
        type: "text",
        name: "extraInfo",
        required: false,
        value: formData?.extraInfo || "",
      },
      //   {
      //     label: "Specialization",
      //     type: "text",
      //     name: "specialization",
      //     required: false,
      //     multiple: true,
      //     numberOfFields: 6,
      //     value: formData?.specialization || "",
      //   },
    ],
  };
  useEffect(() => {
    if (mode === Modes.EDIT && values) {
      setFormData({
        name: values.name || "",
        about: values.about || "",
        address: values.address || "",
        email: values.email || "",
        phone: values.phone || "",
        extraInfo: values.extraInfo || "",
        // specialization: values.specialization?.map((d) => d) || [],
      });
    } else if (mode === Modes.ADD) {
      setFormData({});
    }
  }, [mode, values]);

  const formatValue = (name: string, value: any) => {
    console.log(name);
    return value;
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pkg: InputFieldProps,
  ) => {
    console.log(e);
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
        return { ...prev, [name]: formatValue(name, currentArray) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSave = () => {
    const reqParam = formatPayload.call(formData);
    createPandit(reqParam).then((response) => {
      console.log(response);
      alert("saved data");
      setFormData({});
    });
  };

  console.log(formData);
  return (
    <div className="sectios-container-pkg">
      <Section>
        <Section.Title>
          Pandit
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
                return (
                  <InputField
                    key={`${pkg.name}-${idx}`}
                    {...pkg}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >,
                    ) => handleOnChange(e, pkg)}
                  />
                );
              },
            )}
          </div>
        </Section.Content>
      </Section>
    </div>
  );
};

export default CreatePandit;
