import { useEffect, useMemo, useState } from "react";
import { useEvent } from "../../../services/Event/useEvent";
import { usePackage } from "../../../services/Package/usePackage";
import Button from "../../core/button/Button";
import Spinner from "../../core/spinners/Spinner";
import Table from "../../core/Table/Table";
import type { ColumnProps } from "../../Model/Default";
import { useNavigate } from "react-router-dom";
import { useTemple } from "../../../services/Temple/useTemple";
import Badge from "../../core/Badge/Badge";
import { LuPencil } from "react-icons/lu";
import CreateEvent from "./CreateEvent";
import { useCoreEvent } from "../../../services/CoreEvent/useCoreEvent";

const Events = () => {
  const { events, loading } = useEvent({ autoFetch: true });
  const { fetchPackageByIDs, loading: packageLoading } = usePackage({
    autoFetch: false,
  });
  const { fetchTemplesByIDs, loading: templeLoading } = useTemple({
    autoFetch: false,
  });

  const { coreEvents, loading: coreEventLoading } = useCoreEvent({
    autoFetch: true,
  });

  const [packages, setPackages] = useState<Record<string, any>>({});
  // const [packageLoading, setPackageLoading] = useState(false);
  const navigate = useNavigate();
  const [temple, setTemple] = useState<Record<string, any>>({});
  const [editId, setEditId] = useState<string>(null);

  const columns: ColumnProps[] = [
    {
      id: "coreEventId",
      name: "Core Event",
      render: (x) => {
        return coreEventLoading ? (
          <Spinner color={"primary"} size={"xs"} />
        ) : (
          coreEvents?.find((ce) => ce.type === x.coreEventId)?.title || "N/A"
        );
      },
    },

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
      id: "temples",
      name: "Temples",
      render: (x) => {
        return templeLoading ? (
          <Spinner color={"primary"} size={"xs"} />
        ) : (
          x?.templeId?.map((y) => (
            <span style={{ padding: 5 }}>
              <Badge
                label={temple[y].name}
                type={"bordered"}
                style={{ background: "grey", color: "#fff" }}
              />
            </span>
          ))
        );
      },
    },
    {
      id: "",
      name: "Packages included",
      render: (x) => {
        return packageLoading ? (
          <Spinner variant="bars" color={"primary"} size={"xs"} />
        ) : (
          x?.packageId?.map((y) => (
            <span style={{ padding: 5 }}>
              <Badge
                label={packages[y].name}
                type={"bordered"}
                style={{ background: "grey", color: "#fff" }}
              />
            </span>
          ))
        );
      },
    },
    {
      id: "eventStartTime",
      name: "Event Start Time",
    },
    {
      id: "eventExpirationTime",
      name: "Event Expiry Time",
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
    // alert(JSON.stringify(_id));
  };

  const ids = useMemo(
    () => (events?.length ? events.map((x) => x.packageId).flat() : []),

    [events]
  );

  const idsTemples = useMemo(
    () => (events?.length ? events.map((x) => x.templeId).flat() : []),

    [events]
  );

  useEffect(() => {
    if (!idsTemples.length) return;
    fetchTemplesByIDs(idsTemples).then((res) => {
      const resp = res?.reduce((acc, curr) => {
        const crnt = curr._id;
        return { ...acc, [crnt]: curr };
      }, {});
      setTemple(resp);
    });
  }, [idsTemples, fetchTemplesByIDs]);

  useEffect(() => {
    if (!ids.length) return;

    let isMounted = true;
    // setPackageLoading(true);

    fetchPackageByIDs(ids)
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
          // setPackageLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [ids, fetchPackageByIDs]);

  if (loading) return <Spinner />;

  const addNewEventHandler = () => {
    navigate("createEvent");
  };

  console.log(coreEvents);

  return (
    <div>
      <Table
        records={[...events]}
        pageSize={5}
        config={{
          title: <Button onClick={addNewEventHandler}>+ Add New Event</Button>,
          columns,
        }}
      />
      {editId && (
        <CreateEvent
          setEditId={setEditId}
          mode={"edit"}
          values={{
            packages: events
              ?.filter((x) => x._id === editId)
              ?.flatMap((x) => x.packageId)
              ?.map((x) => packages[x]),
            temple: events
              ?.filter((x) => x._id === editId)
              ?.flatMap((x) => x.templeId)
              ?.map((x) => temple[x]),
            events: events?.find((x) => x._id === editId),
            editId,
          }}
        />
      )}
    </div>
  );
};

export default Events;
