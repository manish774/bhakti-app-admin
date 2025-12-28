type PreviewProps = {
  callback: () => void;
};
const Preview = (props: PreviewProps) => {
  //onst [data, setData] = useState();

  // useEffect(() => {
  //   const xData = props.callback();
  //   //@ts-expect-error expected
  //   setData(xData);
  // }, [props]);
  console.log(props);

  return <div>Preview</div>;
};

export default Preview;
