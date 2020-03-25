import { PaginationWithTotal } from "@querycap-ui/search-controls";
import React, { useState } from "react";

export const Paginations = () => {
  const [pager, setPager] = useState({
    size: 10,
    offset: 0,
    total: 2000,
  });

  return (
    <PaginationWithTotal
      pager={pager}
      onPagerChange={(nextPager) => {
        setPager((pager) => ({ ...pager, ...nextPager }));
      }}
    />
  );
};
