import { usePackage } from "../../../services/Package/usePackage";
import Spinner from "../../core/spinners/Spinner";
import CreatePackages from "./CreatePackages";
const Packages = () => {
  const { packages, loading } = usePackage({ autoFetch: true });
  console.log(packages);
  if (loading) return <Spinner variant={"bars"} />;
  return (
    <div>
      <CreatePackages />
    </div>
  );
};

export default Packages;
