import React from "react";
import Toggle from "../../Toggle/Toggle";
import { TableProps } from "../../../Model/Default";

interface TableHeaderProps {
  title?: string | JSX.Element;
  searchInTable?: (e: any) => any;
  searchText?: string;
  changeTheme?: (e: any) => any;
  clearInput?: (e: any) => any;
  mode?: string;
}
const TableHeader = ({
  searchInTable,
  title,
  clearInput,
  searchText,
  mode,
  changeTheme,
}: TableHeaderProps) => {
  return (
    <div className="footer-container">
      <div className="table-title">{title}</div>
      <div>
        {mode && (
          <div>
            <Toggle
              style={{ position: "relative", top: "0px" }}
              label="Mode"
              onChangeTheme={changeTheme}
            />
          </div>
        )}
      </div>
      <div className="table-search">
        <div className="input-container" style={{ textAlign: "right" }}>
          <input
            className="search"
            onChange={searchInTable}
            placeholder="search..."
            value={searchText}
          />
          <button
            className={`clear-button ${!searchText && "display-none"}`}
            onClick={clearInput}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
