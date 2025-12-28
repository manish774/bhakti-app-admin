// Tree.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TreeRows from "./TreeRows";
import "../generic/Table/Table.scss";
import type { TableProps, ThemeMode } from "../../Model/Default";
import TableHeader from "../generic/Table/TableHeader";
import TableFooter from "../generic/Table/TableFooter";
import { paginationOptions } from "../../utils/TableUtils";
import { useDebounce } from "../../hooks/hooks";
import {
  ASC,
  DESC,
  generateRandomString,
  selectSubarray,
  sortRecords,
} from "../../utils/Index";
/**
 * Create tree table easily.
 *
 * @param {any[]} - Provide any array of object
 * @param {config}  - Provide complete configuration of table
 * @param {pageSize} - initial pagination size
 */
const Tree = ({ records, config, pageSize }: TableProps) => {
  const [expandedRows, setExpandedRows] = useState<any>([]);
  const [currentPagination, setCurrentPagination] = useState<any>(1);
  const [currentRecord, setCurrentRecords] = useState<any>([]);
  const [completeRecord, setCompleteRecord] = useState(records || []);
  const [rowCount, setRowCount] = useState(records?.length || 0);
  const [columnSortState, setColumnSortState] = useState<any>({});
  const [columnNames, setColumnNames] = useState<any>();
  const [itemPerPage, setItemPerPage] = useState(paginationOptions[0]);
  const [searchText, setSearchText] = useState<string>("");
  const debounceSearch = useDebounce(searchText, 1000);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [totalPage, setTotalPage] = useState(
    Math.ceil(completeRecord?.length / itemPerPage)
  );
  console.log(pageSize, theme);

  const { columns, title } = config;

  const toggleExpand = (index: any) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i: any) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const sortableColumns: any = useMemo(
    () => columns.filter((col) => col?.sortable === true).map((co) => co.id),
    [columns]
  );

  const sortColumn = (key: string, order: string) => {
    setCompleteRecord(sortRecords(completeRecord, key, order));
  };

  const searchableColumns = useMemo(
    () => columns.filter((col) => col?.searchable === true).map((co) => co.id),
    [columns]
  );

  const getTotalPage = (rec: any[]) => {
    return Math.ceil(rec?.length / itemPerPage);
  };

  const [currentIndexes, setCurrentIndexes] = useState({
    startIndex: 0,
    offset: itemPerPage,
  });

  const prepareTreeRows = (data: any, isChildren: any, depth: any) => {
    console.log(isChildren);
    return data.map((d: any, index: number) => {
      const col = Object.keys(columns[0]);
      const isRowExpanded = expandedRows.includes(
        `${depth}_${index}_${d[col[0]]}`
      );
      return (
        <React.Fragment key={`${depth}_${index}`}>
          <TreeRows
            rowData={d}
            depth={depth}
            isExpanded={isRowExpanded}
            onToggleExpand={() =>
              toggleExpand(`${depth}_${index}_${d[col[0]]}`)
            }
            index={`${depth}_${index}_${d[col[0]]}`}
            columns={columns}
            data-cy={`${depth}_${index}_${d[col[0]]}`}
          />
          {isRowExpanded &&
            d?.children &&
            prepareTreeRows(d?.children, true, depth + 10)}
        </React.Fragment>
      );
    });
  };

  const tableRows = prepareTreeRows(currentRecord, false, 0);

  useEffect(() => {
    setColumnNames(() => {
      return columns.map((rec) => (
        <th
          style={{
            //@ts-expect-error:yes
            background: rec?.highLight?.bgColor,
            color: rec?.highLight?.color,
          }}
          onClick={() => {
            if (sortableColumns.includes(rec?.id)) {
              sortColumn(rec?.id, columnSortState[rec?.id]);
              setColumnSortState(() => ({
                [rec?.id]: columnSortState[rec?.id] === ASC ? DESC : ASC,
              }));
            }
          }}
          className={`sort ${columnSortState[rec?.id]}`}
          key={rec?.id}
        >
          {rec?.name}
        </th>
      ));
    });
  }, [columnSortState, completeRecord, itemPerPage]);
  const searchInTable = useCallback(
    (e: any) => {
      config?.paginationRequired && setCurrentPagination(1);
      setSearchText(e?.target?.value);
    },
    [columnNames, itemPerPage]
  );

  interface ISearchProps<T> {
    search: string;
    data: T;
    searchableKeys: string[];
  }
  const superSearch = ({ search, data, searchableKeys }: ISearchProps<any>) => {
    console.log(searchableKeys);
    function find(object: any): any {
      return Object.values(object).some((v) => {
        console.log(typeof v);
        return (
          (v && typeof v === "object" && find(v)) ||
          `${v}`.toLowerCase().includes(search.toLocaleLowerCase())
        );
      });
    }
    return data.filter(find);
  };

  useEffect(() => {
    if (searchText) {
      const newRecords = superSearch({
        search: searchText.toString(),
        data: records,
        searchableKeys: searchableColumns,
      });
      debugger;
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

  const handleInputChange = (e: any) => {
    if (e?.target?.value > totalPage) return e.preventDefault();
    if (e?.target?.value) setCurrentPagination(() => e.target.value);
    // setFind(e.target.value);
  };

  const changeItemPerPage = (e: any) => {
    setItemPerPage(parseInt(e?.target?.value));
  };

  useEffect(() => {
    const paginatedRecords = selectSubarray(
      completeRecord,
      currentIndexes?.startIndex,
      currentIndexes?.offset
    );
    setCurrentRecords(paginatedRecords);
  }, [currentPagination, completeRecord, currentIndexes]);

  const clearInput = (e: any) => {
    e.preventDefault();
    setSearchText("");
  };

  const changeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const table = (
    <div>
      <TableHeader
        searchInTable={searchInTable}
        title={title}
        clearInput={clearInput}
        searchText={searchText}
        mode={""}
        changeTheme={changeTheme}
      />
      <table key={generateRandomString(10)}>
        <thead>
          <tr>{columnNames}</tr>
        </thead>
        <tbody>{tableRows}</tbody>
        {!completeRecord?.length && (
          <tr>
            <td colSpan={3}>No records found</td>
          </tr>
        )}
      </table>
      <TableFooter
        rowCount={rowCount}
        handleInputChange={handleInputChange}
        totalPage={totalPage}
        currentPagination={currentPagination}
        paginationRequired={config?.paginationRequired}
        changeItemPerPage={changeItemPerPage}
        paginationOptions={paginationOptions}
        itemPerPage={itemPerPage}
      />
    </div>
  );

  return <div className={`table-container`}>{table}</div>;
};

export default Tree;
