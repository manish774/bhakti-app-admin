import { useState } from "react";
import { useCoreEvent } from "../../../services/CoreEvent/useCoreEvent";
import Button from "../../core/button/Button";
import Spinner from "../../core/spinners/Spinner";
import Table from "../../core/Table/Table";
import type { ColumnProps } from "../../Model/Default";
import { LuPencil } from "react-icons/lu";
import CreateCoreEvent from "./CreateCoreEvent";

const CoreEvents = () => {
  const { coreEvents, loading } = useCoreEvent({ autoFetch: true });
  const [editId, setEditId] = useState<string | null>(null);

  const columns: ColumnProps[] = [
    { id: "title", name: "Title" },
    {
      id: "type",
      name: "Type",
    },
    {
      id: "description",
      name: "Description",
    },
    {
      id: "icon",
      name: "Icon",
      render: (x) =>
        x.icon ? <img src={x.icon} style={{ height: 30 }} /> : "-",
    },
    {
      id: "color",
      name: "Color",
      render: (x) => (
        <div
          style={{
            width: 24,
            height: 14,
            background: x.color || "transparent",
            border: "1px solid #ddd",
          }}
        />
      ),
    },
    {
      id: "visible",
      name: "Visible",
      render: (x) => (x.visible ? "Yes" : "No"),
    },
    {
      id: "",
      name: "",
      render: (x) => (
        <Button size={"xsmall"} onClick={() => setEditId(x.type)}>
          <LuPencil />
        </Button>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <Table
        records={[...coreEvents]}
        pageSize={10}
        config={{
          title: (
            <Button onClick={() => setEditId("ADD")}>+ Add Core Event</Button>
          ),
          columns,
        }}
      />

      {editId && (
        <CreateCoreEvent
          mode={editId === "ADD" ? "add" : "edit"}
          values={
            editId === "ADD"
              ? undefined
              : { event: coreEvents?.find((x) => x.type === editId), editId }
          }
          setEditId={setEditId}
        />
      )}
    </div>
  );
};

export default CoreEvents;
