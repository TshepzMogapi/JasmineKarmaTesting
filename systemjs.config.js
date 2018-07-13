meta: {
  'xlsx'
:
  {
    exports: 'XLSX' // <-- tell SystemJS to expose the XLSX variable
  }
}

map: {
  'xlsx'
:
  'node_modules/xlsx/dist/xlsx.core.min.js',
    'fs'
: '',     // <--|
    'crypto'
: '', // <--| suppress native node modules
    'stream'
: '',  // <--|
    'file-saver'
: 'node_modules/file-saver/FileSaver.js',
}
