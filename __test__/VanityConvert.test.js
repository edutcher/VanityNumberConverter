const { expect, test, toContain } = require("@jest/globals");
const createVanityNumbers = require("../lambda/VanityConvert");

test("phone number +1238378464 responds with 123TESTING", () => {
  expect(createVanityNumbers("+1238378464")).toContain("123TESTING");
});

test("phone number +1238438378 responds with 123THETEST", () => {
  expect(createVanityNumbers("+1238438378")).toContain("123THETEST");
});

test("phone number +1238378843 responds with 123TESTTHE", () => {
  expect(createVanityNumbers("+1238378843")).toContain("123TESTTHE");
});

test("phone number +1235837889 responds with 1235TEST89", () => {
  expect(createVanityNumbers("+1235837889")).toContain("1235TEST89");
});
