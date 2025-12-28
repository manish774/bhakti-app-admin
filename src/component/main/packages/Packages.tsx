import { usePackage } from "../../../services/Package/usePackage";
import Spinner from "../../core/spinners/Spinner";
import CreatePackages from "./CreatePackages";
import PackageList from "./PackageList";
import "./package.css";
const Packages = () => {
  const { packages, loading, refetch } = usePackage({
    autoFetch: true,
  });

  if (loading) return <Spinner variant={"bars"} />;

  return (
    <div>
      <CreatePackages onSuccess={refetch} />
      <PackageList isLoading={loading} packages={packages} />
    </div>
  );
};

export default Packages;
