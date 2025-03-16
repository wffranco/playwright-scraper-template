import Context from "./handlers/Context";

const EXECUTION_TIME = 'Execution time';

(async () => {
  console.time(EXECUTION_TIME);
  // With context we can handle multiple pages that share data, like session and cookies.
  const context = await Context.launch('chromium');
  const mainPage = await context.newPage('https://www.google.com'); // Preload a page if url is provided.

  // Do something...
  console.log('Running...');

  // If you open a new tab from a page, it will open the same url, unless you specify a different one.
  // const newTab = await mainPage.newTab(/* 'https://example.com' */);

  await mainPage.close();

  // If you need a different context, you can create a new one.
  // const newContext = await context.newContext();

  // You can close a context, and it will close all pages/tabs opened on it.
  // await newContext.close();

  // Close the browser when you're done (it will close all contexts).
  await context.browser.close();
  console.timeEnd(EXECUTION_TIME);
})();
