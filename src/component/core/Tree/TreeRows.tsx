const TreeRows = ({
  rowData,
  depth,
  isExpanded,
  onToggleExpand,
  index,
  columns,
  hierarchyColumn,
}: any) => {
  // const prepreCoumns = columns.map((cellData: any) => {
  //   <TreeColumns cellData={cellData} hierarchyColumn={hierarchyColumn}depth={depth} isExpanded={isExpanded} onToggleExpand={onToggleExpand} index={}/>;
  // });
  console.log(hierarchyColumn);
  const prepareCells = columns.map((d: any, i: number) => {
    return i === 0 ? (
      <td width={"400px"} height={"30px"} key={rowData[d?.id]}>
        <span
          style={{
            marginLeft: rowData?.children ? `${depth}px` : `${depth}px`,
          }}
        >
          <span
            onClick={onToggleExpand}
            data-id={index}
            style={{ cursor: "pointer" }}
          >
            {rowData?.children && (isExpanded ? "- " : "+ ")}
          </span>
          <span style={{ marginLeft: rowData?.children ? "0px" : "15px" }}>
            {rowData[d?.id]}
          </span>
        </span>
      </td>
    ) : (
      <td key={rowData[d?.id]}>{rowData[d?.id]}</td>
    );
  });

  return (
    <tr>
      {/* <td width={"400px"} height={"30px"}>
        <span
          style={{
            marginLeft: rowData?.children ? `${depth}px` : `${depth}px`,
          }}
        >
          <span
            onClick={onToggleExpand}
            data-id={index}
            style={{ cursor: "pointer" }}
          >
            {rowData?.children && (isExpanded ? "- " : "+ ")}
          </span>
          <span style={{ marginLeft: rowData?.children ? "0px" : "15px" }}>
            {rowData?.name}
          </span>
        </span>
      </td>
      <td>{rowData?.id}</td>
      <td>{rowData?.shopName}</td> */}
      {prepareCells}
    </tr>
  );
};

export default TreeRows;
