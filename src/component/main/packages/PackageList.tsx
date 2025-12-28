import type { PackageProps } from "../../../services/Package/packages.types";
import Table from "../../core/Table/Table";
import Button from "../../core/button/Button";
import { LuPencil } from "react-icons/lu";
import Spinner from "../../core/spinners/Spinner";

const PackageList = ({
  isLoading,
  packages = [],
}: {
  isLoading: boolean;
  packages: PackageProps[];
}) => {
  if (isLoading) return <Spinner variant={"dots"} />;
  return (
    <div>
      <Table
        records={[...packages]}
        pageSize={5}
        config={{
          paginationRequired: true,
          title: "",
          columns: [
            { name: "name", id: "name" },
            { name: "Title", id: "title" },
            {
              name: "No. of person",
              id: "numberOfPerson",
              highLight: { color: "orange" },
            },
            { name: "Price", id: "price" },
            {
              name: "",
              id: "",
              render: () => (
                <Button size={"xsmall"}>
                  <LuPencil />
                </Button>
              ),
            },
          ],
        }}
      />
    </div>
  );
};

export default PackageList;
