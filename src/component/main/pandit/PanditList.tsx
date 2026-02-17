import Button from "../../core/button/Button";
import { LuPencil } from "react-icons/lu";
import Table from "../../core/Table/Table";
import type { IPandit } from "../../../services/pandit/pandit.types";
import Spinner from "../../core/spinners/Spinner";

const PanditList = ({
  isLoading,
  records = [],
  onEdit,
}: {
  isLoading: boolean;
  records: IPandit[];
  onEdit?: (pkg: IPandit) => void;
}) => {
  if (isLoading) return <Spinner variant={"dots"} />;
  return (
    <Table
      records={[...records]}
      pageSize={10}
      config={{
        paginationRequired: true,
        title: "",
        columns: [
          {
            name: "name",
            id: "name",
            searchable: true,
          },
          { name: "about", id: "about", searchable: true, sortable: true },
          { name: "address", id: "address" },
          { name: "email", id: "email" },
          { name: "phone", id: "phone" },
          { name: "extraInfo", id: "extraInfo" },

          {
            name: "",
            id: "",
            render: (pkg) => (
              <Button size={"xsmall"} onClick={() => onEdit?.(pkg)}>
                <LuPencil />
              </Button>
            ),
          },
        ],
      }}
    />
  );
};

export default PanditList;
