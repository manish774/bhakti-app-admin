import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  generateRandomString,
  selectSubarray,
  sortRecords,
} from "../../utils/Index";
import "../generic/Table/Table.scss";
import "./Table.css";
import { paginationOptions } from "../../utils/TableUtils";
import { ASC, DESC } from "../../utils/Index";
import type { TableProps, ColumnProps, ThemeMode } from "../../Model/Default";
import TableRows from "./TableRows";
import { useDebounce } from "../../hooks/hooks";
import TableHeader from "../generic/Table/TableHeader";
import TableFooter from "../generic/Table/TableFooter";
import Input from "../generic/Input";
// import Input from "../generic/Input";

const Table = ({ records, config, pageSize }: TableProps) => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const [currentRecord, setCurrentRecords] = useState<any[]>([]);
  const [completeRecord, setCompleteRecord] = useState(records || []);
  const [rowCount, setRowCount] = useState(records?.length || 0);
  const [columnSortState, setColumnSortState] = useState<any>({});
  const [columnNames, setColumnNames] = useState<any>();
  const [itemPerPage, setItemPerPage] = useState(pageSize || 5);
  const [searchText, setSearchText] = useState<string>("");
  const debounceSearch = useDebounce(searchText, 1000);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const selectedRecord: any = useRef(null);
  const [totalPage, setTotalPage] = useState(
    Math.ceil(completeRecord?.length / itemPerPage)
  );

  const [currentIndexes, setCurrentIndexes] = useState({
    startIndex: 0,
    offset: itemPerPage,
  });

  const { columns, title, onRowClick } = config; //To-do : make column name form this column and values from column render

  const sortableColumns = useMemo(
    () => columns.filter((col) => col?.sortable === true).map((co) => co.id),
    [columns]
  );

  const sortColumn = (key: string, order: string) => {
    setCompleteRecord(sortRecords(completeRecord, key, order));
  };

  useEffect(() => {
    const sortColumnObject: any = {};
    setColumnSortState((prevColumnSortState: any) => {
      return { ...prevColumnSortState, ...sortColumnObject };
    });
  }, []);

  useEffect(() => {
    //setTimeout(() => {}, 3000);
    setColumnNames(() => {
      return columns.map((rec, i) => (
        <>
          {i === 0 && config?.checkbox && (
            <th>
              {config?.selectAll && (
                <Input
                  type="checkbox"
                  value={""}
                  onchangeHandler={() => {}}
                  style={{ width: "20px" }}
                />
              )}
            </th>
          )}
          <th
            style={{ background: rec?.highLight && rec?.highLight?.color }}
            onClick={() => {
              if (sortableColumns.includes(rec?.id)) {
                sortColumn(rec?.id, columnSortState[rec?.id]);
                setColumnSortState(() => ({
                  [rec?.id]: columnSortState[rec?.id] === ASC ? DESC : ASC,
                }));
              }
            }}
            className={`sort ${columnSortState[rec?.id]} `}
            key={columnSortState[rec?.id]}
          >
            {rec?.name}
          </th>
        </>
      ));
    });
  }, [columnSortState, completeRecord, itemPerPage]);

  const searchableColumns = useMemo(
    () => columns.filter((col) => col?.searchable === true).map((co) => co.id),
    [columns]
  );

  const getTotalPage = (rec: any[]) => {
    return Math.ceil(rec?.length / itemPerPage);
  };

  useEffect(() => {
    let start = itemPerPage * currentPagination - itemPerPage;
    let end = itemPerPage * currentPagination - 1;
    setCurrentIndexes({ startIndex: start, offset: end });
  }, [currentPagination, itemPerPage]);

  useEffect(() => {
    const paginatedRecords = selectSubarray(
      completeRecord,
      currentIndexes?.startIndex,
      currentIndexes?.offset
    );
    setCurrentRecords(paginatedRecords);
  }, [currentPagination, completeRecord, currentIndexes]);

  useEffect(() => {
    if (searchText) {
      const newRecords = records?.filter((rec: any) => {
        const searchValue = searchText?.toString().toLowerCase();
        return searchableColumns.some((column) => {
          const columnValue = rec[column]?.toString()?.toLowerCase();
          return columnValue?.includes(searchValue);
        });
      });
      setCompleteRecord(newRecords);
      setTotalPage(getTotalPage(newRecords));
      setRowCount(newRecords?.length);
    } else {
      setCompleteRecord(records);
      setCurrentIndexes({ startIndex: 0, offset: itemPerPage - 1 });
      setTotalPage(getTotalPage(records));
      setRowCount(records?.length);
    }
  }, [debounceSearch, records, searchableColumns, itemPerPage]);

  const searchInTable = useCallback(
    (e: any) => {
      setCurrentPagination(1);
      setSearchText(e?.target?.value);
    },
    [columnNames, itemPerPage]
  );

  const handleInputChange = (e: any) => {
    if (e?.target?.value > totalPage) return e.preventDefault();
    if (e?.target?.value) setCurrentPagination(() => e.target.value);
    // setFind(e.target.value);
  };

  const createCellContent = (
    record: any,
    column: ColumnProps,
    index: number
  ) => {
    return (
      <TableRows
        record={record}
        column={column}
        config={config}
        columnNumber={index}
      />
    );
  };

  const rows = currentRecord?.map((record: any) => (
    <tr
      key={generateRandomString(10)}
      onClick={() => {
        console.log("first");
        onRowClick(record);
      }}
    >
      {config?.checkbox && (
        <td>
          <Input
            type="checkbox"
            style={{ width: "20px" }}
            onchangeHandler={() => {
              selectedRecord.current = [record];
            }}
            value={JSON.stringify(record)}
          />
        </td>
      )}
      {columns?.map((col, i) => createCellContent(record, col, i))}
    </tr>
  ));

  const changeItemPerPage = (e: any) => {
    setItemPerPage(parseInt(e?.target?.value));
  };

  const clearInput = () => {
    setSearchText("");
  };

  useEffect(() => {
    setTotalPage(Math.ceil(completeRecord?.length / itemPerPage));
  }, [itemPerPage, currentRecord]);

  const changeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`table-container ${`theme-${theme}`}`}>
      <TableHeader
        searchInTable={searchInTable}
        title={title}
        clearInput={clearInput}
        searchText={searchText}
        mode={config?.mode}
        changeTheme={changeTheme}
      />
      <div className="table-main">
        <table
          style={{ minHeight: config?.minHeight || "" }}
          key={generateRandomString(10)}
        >
          <thead>
            <tr>{columnNames}</tr>
          </thead>
          <tbody>
            {rows}
            {!completeRecord?.length && (
              <tr>
                <td colSpan={3}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TableFooter
        rowCount={rowCount}
        handleInputChange={handleInputChange}
        totalPage={totalPage}
        currentPagination={currentPagination}
        paginationRequired={config?.paginationRequired || false}
        changeItemPerPage={changeItemPerPage}
        paginationOptions={paginationOptions}
        itemPerPage={itemPerPage}
      />
    </div>
  );
};

export default Table;
