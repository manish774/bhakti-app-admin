import React from "react";
import Select from "../Select";
import Input from "../Input";

interface TableFooterComp {
  rowCount?: number | string;
  handleInputChange: (e: any) => any;
  totalPage?: number;
  currentPagination?: string | number;
  paginationRequired?: boolean;
  changeItemPerPage: (e: any) => any;
  paginationOptions: any[];
  itemPerPage?: number;
}
const TableFooter = ({
  rowCount,
  handleInputChange,
  totalPage,
  currentPagination,
  paginationRequired,
  changeItemPerPage,
  paginationOptions,
  itemPerPage,
}: TableFooterComp) => {
  return (
    <div className="footer-container">
      <div className="row-count">Total records ({rowCount})</div>
      {paginationRequired && (
        <div className="table-pagination">
          <div className="input-container">
            <Input
              onchangeHandler={handleInputChange}
              type="number"
              max={totalPage}
              min={1}
              value={currentPagination || 1}
            />
            <span style={{ marginLeft: "5px" }}>of {totalPage}</span>
          </div>
        </div>
      )}
      <div className="input-container">
        <Select
          onchangeHandler={changeItemPerPage}
          options={paginationOptions.map((p) => ({ name: p, value: p }))}
          selected={itemPerPage}
          label={"per page"}
        />
      </div>
    </div>
  );
};

export default TableFooter;
