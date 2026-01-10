import { lazy, Suspense, useState } from "react";
import Table from "../../core/Table/Table";

import "./TempleList.css";
import { useTemple } from "../../../services/Temple/useTemple";
import Spinner from "../../core/spinners/Spinner";

const PreviewPanel = lazy(() => import("../Preview/Preview"));

const TempleList = () => {
  // const service = Services.getInstance();
  const [selectedRow, setSelectedRow] = useState();
  // const [record, setRecord] = useState([]);
  // useEffect(() => {
  //   service.getAllTemples().then((resp: any) => {
  //     setRecord(resp);
  //   });
  // }, []);

  const { temples: record, loading } = useTemple({ autoFetch: true });

  const handleRowClick = (args) => {
    setSelectedRow(args._id);
  };

  return (
    <div className="temple-list-container">
      <div className="table">
        {loading ? (
          <Spinner />
        ) : (
          <Table
            loading={loading}
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
        )}
      </div>
      {selectedRow && (
        <Suspense fallback={"Loading..."}>
          <div className="preview">
            //@ts-ignore: ignore
            <PreviewPanel callback={() => {}} />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default TempleList;
