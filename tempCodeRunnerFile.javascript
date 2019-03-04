function hello() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("hello...."), 5000)
  })
}

async function main() {
  return await hello()
  // console.log('=====', typeof x);
}

main().then(console.log)