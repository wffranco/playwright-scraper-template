(async () => {
  const label = 'Execution time';
  console.time(label);

  console.log('Running...');

  console.timeEnd(label);
})();
