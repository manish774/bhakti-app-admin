import InputField from "../../core/input/Input";
import { Section } from "../../core/section/Section";
import Button from "../../core/button/Button";
import { Spinner } from "../../core/spinners/Spinner";
import { useCoreEvent } from "../../../services/CoreEvent/useCoreEvent";
import type { InputFieldProps } from "../../core/types";
import { useEffect, useMemo, useState } from "react";
import { useNotification } from "../../../context/Notification";
import { parseApiError } from "../../../services/apiError";
import type { CoreEventProps } from "../../../services/CoreEvent/coreevent.types";

const CoreEventIds = [
  { label: "Online Puja", value: "coreevent_online_puja" },
  { label: "Offline Puja", value: "coreevent_offline_puja" },
];

const CreateCoreEvent = ({ mode = "add", values, setEditId }: any) => {
  const { loading, create, update } = useCoreEvent({ autoFetch: false });
  const notify = useNotification();

  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (mode === "edit" && values?.event) {
      setFormData({
        title: values.event.title || "",
        type: values.event.type,
        description: values.event.description || "",
        icon: values.event.icon || "",
        color: values.event.color || "",
        shadowColor: values.event.shadowColor || "",
        visible:
          typeof values.event.visible === "boolean"
            ? values.event.visible
            : true,
      });
    }
    if (mode === "add") setFormData({});
  }, [mode, values]);

  const config = useMemo(
    () =>
      [
        {
          label: "Title",
          type: "text",
          name: "title",
          required: true,
          value: formData.title || "",
        },
        {
          label: "Type",
          type: "select",
          name: "type",
          required: true,
          options: CoreEventIds,
          value: formData.type
            ? {
                label: CoreEventIds.find((x) => x.value === formData.type)
                  ?.label,
                value: formData.type,
              }
            : undefined,
        },
        {
          label: "Description",
          type: "textarea",
          name: "description",
          value: formData.description || "",
        },
        {
          label: "Icon URL",
          type: "text",
          name: "icon",
          value: formData.icon || "",
        },
        {
          label: "Color",
          type: "color",
          name: "color",
          value: formData.color || "",
        },
        {
          label: "Shadow Color",
          type: "color",
          name: "shadowColor",
          value: formData.shadowColor || "",
        },
        {
          label: "Visible",
          type: "checkbox",
          name: "visible",
          required: true,
          checked:
            typeof formData.visible === "boolean" ? formData.visible : true,
        },
      ] as InputFieldProps[],
    [formData]
  );

  const handleOnChange = (e: any, pkg: InputFieldProps) => {
    if (pkg.type === "select") {
      setFormData((prev) => ({ ...prev, [pkg.name]: e?.value }));
      return;
    }

    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    const payload: CoreEventProps = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      shadowColor: formData.shadowColor,
      visible: typeof formData.visible === "boolean" ? formData.visible : true,
    };

    (values?.editId
      ? update({ ...payload, type: values.editId })
      : create(payload)
    )
      .then(() => {
        notify(
          `Core Event ${values?.editId ? "Updated" : "Added"} successfully`,
          "success"
        );
        setEditId(null);
      })
      .catch((error: any) => {
        notify(parseApiError(error), "error");
      });
  };

  if (loading) return <Spinner />;

  return (
    <div className="sectios-container-pkg">
      <Section>
        <Section.Title>
          {mode === "edit" ? "Edit Core Event" : "Add Core Event"}
          <div className="action-buttons">
            <Button onClick={onSave}>
              {loading ? (
                <Spinner color="primary" size="xs" />
              ) : mode === "edit" ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Section.Title>
        <Section.Content>
          <div className="section-child-container-event">
            {config.map((x) => (
              <div key={x.name}>
                <InputField onChange={(e) => handleOnChange(e, x)} {...x} />
              </div>
            ))}
          </div>
        </Section.Content>
      </Section>
    </div>
  );
};

export default CreateCoreEvent;
