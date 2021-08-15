const { expect, test, toContain } = require("@jest/globals");
const createVanityNumbers = require("../lambda/VanityConvert");

test("phone number +1238378464 responds with 123testing", () => {
  expect(createVanityNumbers("+1238378464")).toContain("123TESTING");
});
