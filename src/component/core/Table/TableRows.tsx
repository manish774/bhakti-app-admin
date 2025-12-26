import React, { useState, useEffect, useRef } from "react";
import { ColumnProps, tableConfig } from "../../Model/Default";
import { generateRandomString } from "../../utils/Index";

interface RowProps {
  record: any;
  column: ColumnProps;
  config?: tableConfig;
  columnNumber: number;
}
const TableRows = ({ record, column, config, columnNumber }: RowProps) => {
  const [showRowOptions, setShowRowOptions] = useState<boolean>(false);
  const rowOptionsRef = useRef(null);

  const toggleOptions = () => {
    setShowRowOptions(!showRowOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        rowOptionsRef.current &&
        //@ts-ignore
        !rowOptionsRef?.current?.contains(event?.target)
      ) {
        setShowRowOptions(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [rowOptionsRef]);

  const prepareOptionsView = () => {
    return (
      <span style={{ float: "right" }} ref={rowOptionsRef}>
        {column?.hoverAction ? (
          <div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleOptions();
              }}
              className="cursor-pointer"
            >
              ...
            </div>
            {showRowOptions && (
              <span className="panel-simple" style={{ position: "absolute" }}>
                {column?.hoverAction.map((option) => (
                  <li
                    key={option.name}
                    className={`cursor-pointer drop-options`}
                    onClick={(e) => {
                      e.stopPropagation();
                      option?.onclick(record);
                      setShowRowOptions(false);
                    }}
                    style={{ height: "20px", width: "200px" }}
                  >
                    {option.name}
                  </li>
                ))}
              </span>
            )}
          </div>
        ) : (
          ""
        )}
      </span>
    );
  };

  return (
    <td
      style={{
        textAlign: "left",
        borderLeft:
          column?.highLight && `1px solid ${column?.highLight?.color}`,
        borderRight:
          column?.highLight && `1px solid ${column?.highLight?.color}`,
      }}
      key={generateRandomString(10)}
    >
      {column?.render ? column?.render(record) : record[column?.id]}
      {prepareOptionsView()}
    </td>
  );
};

export default TableRows;
