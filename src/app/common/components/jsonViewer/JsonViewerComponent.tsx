import { FC } from "react";
import JsonViewer from "react-json-view";

type Props = {
  src: any;
};

export const JsonViewerComponent: FC<Props> = ({ src }) => {
  return (
    <>
      <JsonViewer
        src={src}
        theme={"bright:inverted"}
        iconStyle="triangle"
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        indentWidth={2}
        collapsed={2}
        collapseStringsAfterLength={50}
        style={{ wordBreak: "break-all" }}
      />
    </>
  );
};
