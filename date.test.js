test("loop through date range", () => {
  const start = new Date(2020, 0, 1);
  const end = new Date(2021, 0, 1);
  let days = [];
  for (let i = start; i < end; i.setDate(i.getDate() + 1)) {
    days.push(new Date(i));
  }
  expect(days.length).toBe(366);
});

function dateRange(start, end) {
  let days = [];
  for (let i = start; i < end; i.setDate(i.getDate() + 1)) {
    days.push(new Date(i));
  }
  return days;
}

test("dateRange", () => {
  const start = new Date(2020, 0, 1);
  const end = new Date(2021, 0, 1);
  expect(dateRange(start, end).length).toBe(366);
});

const dateFns = require("date-fns");

test("format date", () => {
  expect(dateFns.format(new Date(2020, 11, 2), "yyyy-MM-dd")).toBe("2020-12-02");
});
