import { FC } from "react";
import { WithChildren } from "../../../../_metronic/helpers";

type Props = {
  showDeleteBtn?: boolean;
  onClickFilter?: () => any;
  onClickDelete?: () => any;
};

export const TableWrapper: FC<Props & WithChildren> = ({
  children,
  showDeleteBtn,
  onClickFilter,
  onClickDelete,
}) => {
  return <></>;
};
