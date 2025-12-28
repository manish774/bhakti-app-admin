import { useEvent } from "../../../services/Event/useEvent";
import Button from "../../core/button/Button";
import Spinner from "../../core/spinners/Spinner";
import Table from "../../core/Table/Table";
import type { ColumnProps } from "../../Model/Default";

const Events = () => {
  const { events, loading } = useEvent({ autoFetch: true });

  const columns: ColumnProps[] = [
    {
      id: "eventName",
      name: "Name of Event",
    },
  ];
  console.log(events);

  console.log(events);
  if (loading) return <Spinner />;
  return (
    <div>
      <Table
        //@ts-expect-error expected
        records={[...events.data]}
        pageSize={5}
        config={{
          title: <Button>Add New Event</Button>,
          columns,
        }}
      />
    </div>
  );
};

export default Events;
