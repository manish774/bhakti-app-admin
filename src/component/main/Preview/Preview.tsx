import { useEffect } from "react";
type PreviewProps = {
  templeId: string;
};
const Preview = (props: PreviewProps) => {
  useEffect(() => {}, [props]);

  return <div>Preview</div>;
};

export default Preview;
