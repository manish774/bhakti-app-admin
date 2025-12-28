import { lazy, Suspense, useEffect, useState } from "react";
import Services from "../../../services/Services";
import Table from "../../core/Table/Table";

import "./TempleList.css";

const PreviewPanel = lazy(() => import("../Preview/Preview"));

const TempleList = () => {
  const service = Services.getInstance();
  const [selectedRow, setSelectedRow] = useState();
  const [record, setRecord] = useState([]);
  useEffect(() => {
    service.getAllTemples().then((resp: any) => {
      setRecord(resp);
    });
  }, []);

  const handleRowClick = (args) => {
    setSelectedRow(args._id);
  };
  return (
    <div className="temple-list-container">
      <div className="table">
        <Table
          records={[...record]}
          pageSize={5}
          config={{
            paginationRequired: true,
            title: "tes",
            onRowClick: handleRowClick,
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
      {selectedRow && (
        <Suspense fallback={"Loading..."}>
          <div className="preview">
            <PreviewPanel />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default TempleList;
