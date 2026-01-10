import { useEffect, useMemo, useState } from "react";
import { useBooking } from "../../../services/booking/useBooking";
import { usePackage } from "../../../services/Package/usePackage";
import { useTemple } from "../../../services/Temple/useTemple";
import Button from "../../core/button/Button";
import Spinner from "../../core/spinners/Spinner";
import Table from "../../core/Table/Table";
import type { ColumnProps } from "../../Model/Default";
import { useNavigate } from "react-router-dom";
import Badge from "../../core/Badge/Badge";
import { LuPencil } from "react-icons/lu";
import CreateBooking from "./CreateBooking";

const Bookings = () => {
  const { bookings, loading } = useBooking({ autoFetch: true });
  const { fetchPackageByIDs, loading: packageLoading } = usePackage({
    autoFetch: false,
  });
  const { fetchTemplesByIDs, loading: templeLoading } = useTemple({
    autoFetch: false,
  });

  const [packages, setPackages] = useState<Record<string, any>>({});
  const [temples, setTemples] = useState<Record<string, any>>({});
  const [pujas, setPujas] = useState<Record<string, any>>({});
  const [users, setUsers] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const [editId, setEditId] = useState<string>(null);

  console.log(setPujas, setUsers);
  const columns: ColumnProps[] = [
    {
      id: "coreType",
      name: "Core Type",
    },
    {
      id: "userId",
      name: "User",
      render: (x) => {
        return users[x.userId]?.name || users[x.userId]?.email || "N/A";
      },
    },
    {
      id: "temples",
      name: "Temples",
      render: (x) => {
        return templeLoading ? (
          <Spinner color={"primary"} size={"xs"} />
        ) : (
          x?.templeId && (
            <span key={x.templeId?._id} style={{ padding: 5 }}>
              <Badge
                label={x.templeId.name || "N/A"}
                type={"bordered"}
                style={{ background: "grey", color: "#fff" }}
              />
            </span>
          )
        );
      },
    },

    {
      id: "packages",
      name: "Packages",
      render: (x) => {
        return packageLoading ? (
          <Spinner variant="bars" color={"primary"} size={"xs"} />
        ) : (
          <span key={x.packageId} style={{ padding: 5 }}>
            <Badge
              label={packages[x.packageId]?.name || "N/A"}
              type={"bordered"}
              style={{ background: "grey", color: "#fff" }}
            />
          </span>
        );
      },
    },
    {
      id: "totalAmount",
      name: "Total Amount",
      render: (x) => `₹${x.totalAmount}`,
    },
    {
      id: "status",
      name: "Status",
      render: (x) => (
        <Badge
          label={x.status}
          type={"bordered"}
          style={{
            background:
              x.status === "completed"
                ? "green"
                : x.status === "confirmed"
                ? "blue"
                : x.status === "cancelled"
                ? "red"
                : "orange",
            color: "#fff",
          }}
        />
      ),
    },
    {
      id: "paymentStatus",
      name: "Payment Status",
      render: (x) => (
        <Badge
          label={x.paymentStatus}
          type={"bordered"}
          style={{
            background:
              x.paymentStatus === "paid"
                ? "green"
                : x.paymentStatus === "failed"
                ? "red"
                : x.paymentStatus === "refunded"
                ? "orange"
                : "grey",
            color: "#fff",
          }}
        />
      ),
    },
    {
      id: "pujaDate",
      name: "Puja Date",
      render: (x) => new Date(x.pujaDate).toLocaleDateString(),
    },
    {
      id: "edit",
      name: "",
      render: (x) => (
        <Button size={"xsmall"} onClick={() => onEdit(x)}>
          <LuPencil />
        </Button>
      ),
    },
  ];

  const onEdit = ({ _id }: { _id: string }) => {
    setEditId(_id);
  };

  const packageIds = useMemo(
    () => (bookings?.length ? bookings.map((x) => x.packageId).flat() : []),
    [bookings]
  );

  const templeIds = useMemo(
    () => (bookings?.length ? bookings.map((x) => x.templeId).flat() : []),
    [bookings]
  );

  const pujaIds = useMemo(
    () => (bookings?.length ? bookings.map((x) => x.pujaId).flat() : []),
    [bookings]
  );

  useEffect(() => {
    if (!templeIds.length) return;
    fetchTemplesByIDs(templeIds).then((res) => {
      const resp = res?.reduce((acc, curr) => {
        const crnt = curr._id;
        return { ...acc, [crnt]: curr };
      }, {});
      setTemples(resp);
    });
  }, [templeIds, fetchTemplesByIDs]);

  useEffect(() => {
    if (!packageIds.length) return;

    let isMounted = true;

    fetchPackageByIDs(packageIds)
      .then((res) => {
        const resp = res?.reduce((acc, curr) => {
          const crnt = curr._id;
          return { ...acc, [crnt]: curr };
        }, {});
        if (isMounted) {
          setPackages(resp);
        }
      })
      .finally(() => {
        if (isMounted) {
          // cleanup
        }
      });

    return () => {
      isMounted = false;
    };
  }, [packageIds, fetchPackageByIDs]);

  // Fetch pujas and users similarly
  useEffect(() => {
    if (!pujaIds.length) return;
    // Assuming you have a fetchPujasByIDs method
    // fetchPujasByIDs(pujaIds).then((res) => {
    //   const resp = res?.reduce((acc, curr) => {
    //     return { ...acc, [curr._id]: curr };
    //   }, {});
    //   setPujas(resp);
    // });
  }, [pujaIds]);

  if (loading) return <Spinner />;

  const addNewBookingHandler = () => {
    navigate("createBooking");
  };

  return (
    <div>
      <Table
        records={[...bookings]}
        pageSize={5}
        config={{
          title: (
            <Button onClick={addNewBookingHandler}>+ Add New Booking</Button>
          ),
          columns,
        }}
      />
      <CreateBooking
        setEditId={setEditId}
        mode={editId ? "edit" : "add"}
        values={{
          packages: bookings
            ?.filter((x) => x._id === editId)
            ?.flatMap((x) => x.packageId)
            ?.map((x) => packages[x]),
          temple: bookings
            ?.filter((x) => x._id === editId)
            ?.flatMap((x) => x.templeId)
            ?.map((x) => temples[x]),
          puja: bookings
            ?.filter((x) => x._id === editId)
            ?.flatMap((x) => x.pujaId)
            ?.map((x) => pujas[x]),
          user: bookings
            ?.filter((x) => x._id === editId)
            ?.map((x) => users[x.userId])[0],
          booking: bookings?.find((x) => x._id === editId),
          editId,
        }}
      />
    </div>
  );
};

export default Bookings;
