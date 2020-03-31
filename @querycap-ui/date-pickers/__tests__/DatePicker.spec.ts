import { formatRFC3339, parseISO } from "date-fns";
import { getDaysInMonth } from "@querycap-ui/date-pickers";

test("getDaysInMonth should get days list in mouth", () => {
  const days = getDaysInMonth("2016-01-01", 1);

  expect(days.length).toBe(42);
  expect(formatRFC3339(days[0])).toBe(formatRFC3339(parseISO("2015-12-28")));
});
