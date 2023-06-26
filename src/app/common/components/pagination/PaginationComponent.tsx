import { FC, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

type Props = {
  pageCount: number;
  onPageChange: (page: any) => any;
  showingFrom: number;
  showingTill: number;
  totalRecords: number;
  currentPage?: number;
};

export const PaginationComponent: FC<Props> = ({
  pageCount,
  onPageChange,
  showingFrom,
  showingTill,
  totalRecords,
  currentPage,
}) => {
  const [forcePage, setForcePage] = useState(0);

  useEffect(() => {
    setForcePage(currentPage && currentPage > 1 ? currentPage - 1 : 0);
  }, [currentPage]);

  return (
    <>
      <div className="d-flex align-items-center py-3">
        <span className="react-bootstrap-table-pagination-total text-gray-800 fw-bold">
          Showing rows {showingFrom} to {showingTill} of {totalRecords}
        </span>
      </div>
      <ReactPaginate
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={onPageChange}
        containerClassName="pagination pagination-outline"
        activeClassName="active"
        previousClassName="page-item m-1"
        previousLinkClassName="page-link"
        nextClassName="page-item m-1"
        nextLinkClassName="page-link"
        previousLabel={<i className="fa-solid fa-angles-left"></i>}
        nextLabel={<i className="fa-solid fa-angles-right"></i>}
        pageClassName="page-item m-1"
        pageLinkClassName="page-link"
        breakClassName="page-item disabled m-1"
        breakLabel={<span className="page-link">...</span>}
        forcePage={forcePage}
      />
    </>
  );
};
