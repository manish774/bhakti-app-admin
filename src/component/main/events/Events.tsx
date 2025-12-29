import { useEffect, useMemo, useState } from "react";
import { useEvent } from "../../../services/Event/useEvent";
import { usePackage } from "../../../services/Package/usePackage";
import Button from "../../core/button/Button";
import Spinner from "../../core/spinners/Spinner";
import Table from "../../core/Table/Table";
import type { ColumnProps } from "../../Model/Default";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const { events, loading } = useEvent({ autoFetch: true });
  const { fetchPackageByIDs } = usePackage({ autoFetch: false });

  const [packages, setPackages] = useState<Record<string, any>>({});
  const [packageLoading, setPackageLoading] = useState(false);
  const navigate = useNavigate();
  const columns: ColumnProps[] = [
    {
      id: "eventName",
      name: "Name of Event",
    },
    {
      id: "isPopular",
      name: "Is Popular",
      render: (x) => {
        return x.isPopular ? "Yes" : "No";
      },
    },
    {
      id: "",
      name: "Packages included",
      render: (x) => {
        return packageLoading ? (
          <Spinner variant="bars" />
        ) : (
          x.packageId?.map((y) => (
            <span style={{ padding: 5 }}>{packages[y].name}</span>
          ))
        );
      },
    },
  ];

  const ids = useMemo(
    () =>
      //@ts-expect-error expect
      events?.data?.length ? events.data.map((x) => x.packageId).flat() : [],
    //@ts-expect-error expect
    [events?.data]
  );

  useEffect(() => {
    if (!ids.length) return;

    let isMounted = true;
    setPackageLoading(true);
    console.log(ids);
    fetchPackageByIDs(ids)
      .then((res) => {
        console.log(res, "res");
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
          setPackageLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [ids, fetchPackageByIDs]);

  if (loading || packageLoading) return <Spinner />;

  const addNewEventHandler = () => {
    navigate("createEvent");
  };
  return (
    <div>
      <Table
        //@ts-expect-error expected
        records={[...events.data]}
        pageSize={5}
        config={{
          title: <Button onClick={addNewEventHandler}>+ Add New Event</Button>,
          columns,
        }}
      />
    </div>
  );
};

export default Events;
