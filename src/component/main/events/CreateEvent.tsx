import InputField from "../../core/input/Input";
import { Section } from "../../core/section/Section";
import Button from "../../core/button/Button";
import { Spinner } from "../../core/spinners/Spinner";
import { useEvent } from "../../../services/Event/useEvent";
import type { InputFieldProps } from "../../core/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import Services from "../../../services/Services";
import { usePackage } from "../../../services/Package/usePackage";
import "./event.css";
import { useNotification } from "../../../context/Notification";
import type { EventProps } from "../../../services/Event/event.types";

type IPackagePriceData = {
  id: string;
  price: string | number;
  discount?: string | number;
  label?: string;
};

const Modes = {
  EDIT: "edit",
  ADD: "add",
} as const;

type Modes = (typeof Modes)[keyof typeof Modes];

type EMode = {
  mode?: Modes;
  values?: {
    packages: Record<string, any>[];
    temple: Record<string, any>[];
    editId: string;
    events: EventProps;
  };
  setEditId?: React.Dispatch<React.SetStateAction<string>>;
};

type PriceField = "price" | "discount";

const CreateEvent = ({ mode = Modes.ADD, values }: EMode) => {
  const { loading, create, update } = useEvent({ autoFetch: false });
  const { loading: pkgLoading, packages } = usePackage({ autoFetch: true });
  const service = Services.getInstance();
  const [templeList, setTempleList] = useState([]);

  // Initialize formData with values in edit mode
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (mode === Modes.EDIT && values) {
      setFormData({
        eventName: values?.events?.eventName || "",
        eventStartTime: values?.events?.eventStartTime,
        eventExpirationTime: values?.events?.eventExpirationTime,
        templeId: values.temple?.map((x) => ({ label: x.name, value: x._id })),
        packageId: values.packages?.map((x) => ({
          label: x.name,
          value: x._id,
        })),
        isPopular: values?.events?.isPopular || false,
      });
    }
    if (mode === Modes.EDIT && values?.events?.pricePackageId) {
      setPackagePriceData(
        values?.events?.pricePackageId.map((pkg) => ({
          id: pkg.packageId,
          label: values?.packages?.find((x) => x._id === pkg.packageId)?.name,
          price: pkg.price || "",
          discount: pkg.discount || "",
        }))
      );
    }

    if (mode === Modes.ADD) {
      setFormData({});
      setPackagePriceData([]);
    }
  }, [values, mode]);

  const [packagePriceData, setPackagePriceData] =
    useState<IPackagePriceData[]>();
  const notify = useNotification();

  const eventConfig = useMemo(
    () => [
      {
        label: "Event Name",
        type: "text",
        name: "eventName",
        required: true,
        value: formData.eventName || "",
      },
      {
        label: "Select Temples",
        type: "select",
        name: "templeId",
        required: true,
        options: (templeList || [])?.map((x) => ({
          label: x.name,
          value: x._id,
        })),
        multiple: true,
        value: formData.templeId || [],
      },
      {
        label: "Select Packages",
        type: "select",
        name: "packageId",
        required: true,
        multiple: true,
        options: (packages || [])?.map((x) => ({
          label: x.name,
          value: x._id,
        })),
        value: formData.packageId || [],
      },
      {
        label: "Event Start Date",
        type: "datetime-local" as const,
        name: "eventStartTime",
        required: true,
        value: formData.eventStartTime || "",
      },
      {
        label: "Event Expiry Date",
        type: "datetime-local" as const,
        name: "eventExpirationTime",
        required: true,
        value: formData.eventExpirationTime || "",
      },
      {
        label: "Is Popular",
        type: "checkbox",
        name: "isPopular",
        required: true,
        checked: formData.isPopular || false,
      },
    ] as InputFieldProps[],
    [packages, templeList, formData]
  );

  useEffect(() => {
    service.getAllTemples().then((resp) => {
      setTempleList(resp);
    });
  }, []);

  const formatValue = (value: any) => {
    return value;
  };

  const updatePriceOfPackage = useCallback(
    (data: { label: string; value: string }[]) => {
      setPackagePriceData((prev = []) => {
        const prevMap = new Map(prev.map((p) => [p.id, p]));

        return data.map((x) => {
          const existing = prevMap.get(x.value);

          if (existing) {
            // already exists → keep old price & discount
            return {
              ...existing,
              label: x.label, // keep label in sync
            };
          }

          // new package → initialize
          return {
            id: x.value,
            label: x.label,
            price: "",
            discount: "",
          };
        });
      });
    },
    []
  );

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pkg: InputFieldProps
  ) => {
    if (pkg.type === "select") {
      setFormData((prev) => ({ ...prev, [pkg.name]: e }));
      if (pkg.name === "packageId") {
        //@ts-expect-error ignore as it will be array from select
        updatePriceOfPackage(e);
      }
      return;
    }
    const isMultiple = pkg?.numberOfFields > 0;
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
        return { ...prev, [name]: formatValue(currentArray) };
      });
    } else {
      console.log(value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSaveEvent = () => {
    const packageId = formData.packageId?.map((x) => x.value);
    const templeId = formData.templeId?.map((x) => x.value);
    const pricePackageId = packagePriceData?.map((x) => ({
      packageId: x.id,
      price: x.price,
      discount: x.discount,
    }));
    const payload = { ...formData, packageId, pricePackageId, templeId };
    (values?.editId
      ? //@ts-expect-error payload event name issue

        update({ ...payload, id: values.editId })
      : //@ts-expect-error payload event name issue

        create(payload)
    )
      .then(() => {
        notify(
          `Event ${values?.editId ? "Updated" : "Added"} successfully`,
          "success"
        );
      })
      .catch(() => {
        notify("Somthing went wrong!", "error");
      })
      .finally(() => {
        // if (values?.editId) {
        //   setEditId("ADD");
        //   setFormData({});
        // }
      });
  };

  const updatePackagePriceData = (
    id: string,
    field: PriceField,
    value: string
  ) => {
    setPackagePriceData((prev = []) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleFieldChange =
    (field: PriceField, id: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      updatePackagePriceData(id, field, e.target.value);
    };

  if (pkgLoading) return <Spinner variant="circular" />;

  return (
    <>
      <div className="sectios-container-pkg">
        <Section>
          <Section.Title>
            Add New Event
            <div className="action-buttons">
              <Button onClick={onSaveEvent}>
                {loading && <Spinner color="primary" size="xs" />}
                {mode === Modes.EDIT ? "Update" : "Save"}
              </Button>
            </div>
          </Section.Title>
          <Section.Content>
            <div className="section-child-container-event">
              {eventConfig.map((x) => {
                return (
                  <div key={x.name}>
                    {/* @ts-expect-error  not an issue */}
                    <InputField onChange={(e) => handleOnChange(e, x)} {...x} />
                  </div>
                );
              })}
            </div>
          </Section.Content>
          {packagePriceData?.length > 0 && (
            <Section.Content>
              {packagePriceData?.map((x) => (
                <div key={x.id}>
                  {x.label}
                  <div className={"package-price-form"}>
                    <InputField
                      placeholder={"Enter Price"}
                      type="number"
                      onChange={handleFieldChange("price", x.id)}
                      value={x.price}
                    />
                    <InputField
                      placeholder={"Enter Discount %"}
                      type="number"
                      onChange={handleFieldChange("discount", x.id)}
                      value={x.discount}
                    />
                  </div>
                </div>
              ))}
            </Section.Content>
          )}
        </Section>
      </div>
    </>
  );
};

export default CreateEvent;
