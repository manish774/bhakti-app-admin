import { useState } from "react";
import CreatePandit from "./CreatePandit";
import PanditList from "./PanditList";
import { usePandit } from "../../../services/pandit/usePandit";
import Spinner from "../../core/spinners/Spinner";

const Pandit = () => {
  const { pandits, loading, refetch } = usePandit({ autoFetch: true });

  const [editId, setEditId] = useState<string | null>(null);

  const onEdit = (pkg) => setEditId(pkg._id);

  if (loading) return <Spinner variant={"bars"} />;
  return (
    <div>
      <CreatePandit
        onSuccess={refetch}
        mode={editId ? "edit" : "add"}
        values={editId ? pandits?.find((x) => x.id === editId) : null}
      />
      <PanditList records={pandits} isLoading={loading} onEdit={onEdit} />
    </div>
  );
};

export default Pandit;
