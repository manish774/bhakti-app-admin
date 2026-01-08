import InputField from "../../core/input/Input";
import { Section } from "../../core/section/Section";
import Button from "../../core/button/Button";
import { Spinner } from "../../core/spinners/Spinner";
import { useBooking } from "../../../services/booking/useBooking";
import type { InputFieldProps } from "../../core/types";
import { useEffect, useMemo, useState } from "react";
import { usePackage } from "../../../services/Package/usePackage";
import { useNotification } from "../../../context/Notification";
import { parseApiError } from "../../../services/apiError";
import type {
  BookingProps,
  BookingDevotee,
} from "../../../services/booking/bookings.types";
import { useCoreEvent } from "../../../services/CoreEvent/useCoreEvent";
import { useEvent } from "../../../services/Event/useEvent";
import { useUser } from "../../../services/user/useUsers";
import { useTemple } from "../../../services/Temple/useTemple";

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
    puja: Record<string, any>[];
    user: Record<string, any>;
    editId: string;
    booking: BookingProps;
  };
  setEditId?: React.Dispatch<React.SetStateAction<string>>;
};

const CreateBooking = ({ mode = Modes.ADD, values }: EMode) => {
  const {
    coreEvents,
    loading: coreEventLoading,
    fetch: fetchCoreEvents,
  } = useCoreEvent({ autoFetch: true });

  const { loading, createBooking, updateBooking } = useBooking({
    autoFetch: false,
  });

  const {
    events,
    loading: eventLoading,
    fetch: fetchEvents,
  } = useEvent({
    autoFetch: true,
  });

  const {
    loading: pkgLoading,
    packages,
    fetchPackages,
  } = usePackage({
    autoFetch: true,
  });

  const {
    users,
    loading: userLoading,
    fetchUsers,
  } = useUser({
    autoFetch: true,
  });

  const {
    temples,
    loading: templeLoading,
    fetchTemples,
  } = useTemple({
    autoFetch: true,
  });

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [devotees, setDevotees] = useState<BookingDevotee[]>([
    { name: "", gotra: "", phoneNumber: "", email: "" },
  ]);

  const notify = useNotification();

  // -------------------- Refresh --------------------
  const isRefreshing =
    coreEventLoading ||
    eventLoading ||
    pkgLoading ||
    userLoading ||
    templeLoading;

  const onRefresh = () => {
    fetchCoreEvents?.();
    fetchEvents?.();
    fetchPackages?.();
    fetchUsers?.();
    fetchTemples?.();
  };
  // -------------------------------------------------

  useEffect(() => {
    if (mode === Modes.EDIT && values) {
      setFormData({
        coreType: values?.booking?.coreType || "",
        eventId: values?.booking?.eventId || "",
        userId: values.user
          ? { label: values.user.name, value: values.user._id }
          : null,
        pujaId: values.puja?.map((x) => ({ label: x.name, value: x._id })),
        templeId: values.temple?.map((x) => ({ label: x.name, value: x._id })),
        packageId: values.packages?.map((x) => ({
          label: x.name,
          value: x._id,
        })),
        totalAmount: values?.booking?.totalAmount || 0,
        prasadIncluded: values?.booking?.prasadIncluded || false,
        prasadCharge: values?.booking?.prasadCharge || 0,
        bookingDate: values?.booking?.bookingDate,
        pujaDate: values?.booking?.pujaDate,
        status: values?.booking?.status || "pending",
        paymentStatus: values?.booking?.paymentStatus || "pending",
        paymentId: values?.booking?.paymentId || "",
        videoUrl: values?.booking?.videoUrl || "",
        notes: values?.booking?.notes || "",
      });

      if (values?.booking?.devotees?.length) {
        setDevotees(values.booking.devotees);
      }
    }

    if (mode === Modes.ADD) {
      setFormData({});
      setDevotees([{ name: "", gotra: "", phoneNumber: "", email: "" }]);
    }
  }, [values, mode]);

  const bookingConfig = useMemo(
    () =>
      [
        {
          label: "Core Type",
          type: "select",
          name: "coreType",
          required: true,
          options: coreEvents?.map((x) => ({
            label: x.title,
            value: x._id,
          })),
          value: formData.coreType || "",
          loading: coreEventLoading,
        },
        {
          label: "Event ",
          type: "select",
          name: "eventId",
          required: true,
          options: events?.map((x) => ({
            label: x.eventName,
            value: x._id,
          })),
          value: formData.eventId || "",
          loading: eventLoading,
        },
        {
          label: "Select User",
          type: "select",
          name: "userId",
          required: true,
          options: (users || [])?.map((x) => ({
            label: x.name || x.email,
            value: x._id,
          })),
          value: formData.userId || null,
          loading: userLoading,
        },
        {
          label: "Select Temple",
          type: "select",
          name: "templeId",
          required: true,
          options: (temples || [])?.map((x) => ({
            label: x.name,
            value: x._id,
          })),
          multiple: true,
          value: formData.templeId || [],
          loading: templeLoading,
        },
        {
          label: "Select Package",
          type: "select",
          name: "packageId",
          required: true,
          options: (packages || [])?.map((x) => ({
            label: x.name,
            value: x._id,
          })),
          multiple: true,
          value: formData.packageId || [],
          loading: pkgLoading,
        },
        {
          label: "Total Amount",
          type: "number",
          name: "totalAmount",
          required: true,
          value: formData.totalAmount || "",
        },
        {
          label: "Prasad Included",
          type: "checkbox",
          name: "prasadIncluded",
          checked: formData.prasadIncluded || false,
        },
        {
          label: "Prasad Charge",
          type: "number",
          name: "prasadCharge",
          value: formData.prasadCharge || "",
        },
        {
          label: "Booking Date",
          type: "datetime-local" as const,
          name: "bookingDate",
          required: true,
          value: formData.bookingDate || "",
        },
        {
          label: "Puja Date",
          type: "datetime-local" as const,
          name: "pujaDate",
          required: true,
          value: formData.pujaDate || "",
        },
        {
          label: "Status",
          type: "select",
          name: "status",
          required: true,
          options: [
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ],
          value: formData.status
            ? { label: formData.status, value: formData.status }
            : null,
        },
        {
          label: "Payment Status",
          type: "select",
          name: "paymentStatus",
          required: true,
          options: [
            { label: "Pending", value: "pending" },
            { label: "Paid", value: "paid" },
            { label: "Failed", value: "failed" },
            { label: "Refunded", value: "refunded" },
          ],
          value: formData.paymentStatus
            ? { label: formData.paymentStatus, value: formData.paymentStatus }
            : null,
        },
        {
          label: "Payment ID",
          type: "text",
          name: "paymentId",
          value: formData.paymentId || "",
        },
        {
          label: "Video URL",
          type: "text",
          name: "videoUrl",
          value: formData.videoUrl || "",
        },
        {
          label: "Notes",
          type: "textarea",
          name: "notes",
          value: formData.notes || "",
        },
      ] as InputFieldProps[],
    [
      packages,
      formData,
      pkgLoading,
      coreEventLoading,
      coreEvents,
      eventLoading,
      events,
      userLoading,
      users,
      temples,
      templeLoading,
    ]
  );

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pkg: InputFieldProps
  ) => {
    if (pkg.type === "select") {
      setFormData((prev) => ({ ...prev, [pkg.name]: e }));
      return;
    }

    if (!e.target?.name) return;
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDevoteeChange = (
    index: number,
    field: keyof BookingDevotee,
    value: string
  ) => {
    setDevotees((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addDevotee = () => {
    setDevotees((prev) => [
      ...prev,
      { name: "", gotra: "", phoneNumber: "", email: "" },
    ]);
  };

  const removeDevotee = (index: number) => {
    if (devotees.length > 1) {
      setDevotees((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onSaveBooking = () => {
    const payload = {
      ...formData,
      userId: formData.userId?.value,
      pujaId: formData.pujaId?.map((x) => x.value),
      templeId: formData.templeId?.map((x) => x.value),
      packageId: formData.packageId?.map((x) => x.value),
      status: formData.status?.value,
      paymentStatus: formData.paymentStatus?.value,
      devotees,
    };

    (values?.editId
      ? //@ts-expect-error ignore
        updateBooking({ ...payload, id: values.editId })
      : //@ts-expect-error ignore
        createBooking(payload)
    )
      .then(() => {
        notify(
          `Booking ${values?.editId ? "Updated" : "Created"} successfully`,
          "success"
        );
      })
      .catch((error: any) => {
        notify(parseApiError(error), "error");
      });
  };

  return (
    <div className="sectios-container-pkg">
      <Section>
        <Section.Title>
          {mode === Modes.EDIT ? "Edit Booking" : "Add New Booking"}

          <div className="action-buttons">
            <Button
              variant="secondary"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Button onClick={onSaveBooking}>
              {loading && <Spinner color="primary" size="xs" />}
              {mode === Modes.EDIT ? "Update" : "Save"}
            </Button>
          </div>
        </Section.Title>

        <Section.Content>
          <div className="section-child-container-event">
            {bookingConfig.map((x) => (
              <div key={x.name}>
                {/* @ts-expect-error not an issue */}
                <InputField onChange={(e) => handleOnChange(e, x)} {...x} />
              </div>
            ))}
          </div>
        </Section.Content>

        <Section.Content>
          <h3>Devotees</h3>

          {devotees.map((devotee, index) => (
            <div key={index} className="devotee-form">
              <h4>Devotee {index + 1}</h4>

              <div className="devotee-fields">
                <InputField
                  label="Name"
                  type="text"
                  value={devotee.name}
                  onChange={(e) =>
                    handleDevoteeChange(index, "name", e.target.value)
                  }
                  required
                />
                <InputField
                  label="Gotra"
                  type="text"
                  value={devotee.gotra}
                  onChange={(e) =>
                    handleDevoteeChange(index, "gotra", e.target.value)
                  }
                />
                <InputField
                  label="Phone Number"
                  type="text"
                  value={devotee.phoneNumber}
                  onChange={(e) =>
                    handleDevoteeChange(index, "phoneNumber", e.target.value)
                  }
                />
                <InputField
                  label="Email"
                  type="email"
                  value={devotee.email}
                  onChange={(e) =>
                    handleDevoteeChange(index, "email", e.target.value)
                  }
                />
              </div>

              {devotees.length > 1 && (
                <Button onClick={() => removeDevotee(index)} size="small">
                  Remove Devotee
                </Button>
              )}
            </div>
          ))}

          <Button onClick={addDevotee}>+ Add Devotee</Button>
        </Section.Content>
      </Section>
    </div>
  );
};

export default CreateBooking;
