import { usePackage } from "../../../services/Package/usePackage";
import Spinner from "../../core/spinners/Spinner";
import CreatePackages from "./CreatePackages";
import PackageList from "./PackageList";
import "./package.css";
import { useState } from "react";
const Packages = () => {
  const { packages, loading, refetch } = usePackage({
    autoFetch: true,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const onEdit = (pkg) => setEditId(pkg._id);

  if (loading) return <Spinner variant={"bars"} />;

  return (
    <div>
      <CreatePackages onSuccess={refetch} />
      <PackageList isLoading={loading} packages={packages} onEdit={onEdit} />
      {editId && (
        <CreatePackages
          onSuccess={() => {
            setEditId(null);
            refetch();
          }}
          mode={"edit"}
          values={packages.find((x) => x._id === editId)}
          setEditId={setEditId}
        />
      )}
    </div>
  );
};

export default Packages;
