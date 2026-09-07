const snapsave = require("./index.cjs");

async function test(url) {
  let result = await snapsave(url);
  return result;
}

test("https://www.instagram.com/p/DLHQfPiyucu/")
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
