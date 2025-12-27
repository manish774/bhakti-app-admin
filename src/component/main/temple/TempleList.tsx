import { useEffect, useState } from "react";
import Services from "../../../services/Services";
import Table from "../../core/Table/Table";
const TempleList = () => {
  const service = Services.getInstance();
  const [record, setRecord] = useState([]);
  useEffect(() => {
    service.getAllTemples().then((resp: any) => {
      setRecord(resp);
    });
  }, []);

  return (
    <div>
      <Table
        records={[...record]}
        pageSize={5}
        config={{
          paginationRequired: true,
          title: "tes",
          columns: [
            { name: "Name", id: "name", searchable: true },
            {
              name: "location",
              id: "location",
              render: (x) => x.location.addressLine1,
            },
          ],
        }}
      />
    </div>
  );
};

export default TempleList;
