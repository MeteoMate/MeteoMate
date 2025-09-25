const mapshaper = require('mapshaper');
const fs = require('fs');

// here you can specify if you want to convert GeoJSON to TopoJSON
const toTopojson = false;

const path = './output';

fs.readdir(path, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    for (const file of files) {
        if (file.endsWith('.geojson')) {
            simplify(`${path}/${file}`, toTopojson);
            removeID0(`${path}/${file}`);;
        }
    }
});

const simplify = (file, toTopojson = false) => {
    const format = toTopojson ? 'topojson' : 'geojson';
    const output = `simplified/${toTopojson ? 'topojson/' : ''}${file.replace('.geojson', toTopojson ? '.json' : '.geojson')}`;

    mapshaper.runCommands(`${file} -simplify visvalingam percentage=50% -o format=${format} ${output.replace('output/', '')}`, function (err) {
        if (err) {
            console.error('Error simplifying GeoJSON:', err);
            return;
        }
        console.log('GeoJSON has been simplified!');
    });
}

const removeID0 = (file) => {
    const output = `simplified/${file}`;

    mapshaper.runCommands(`${file} -filter 'ID != 0' -o format=geojson ${output.replace('output/', '')}`, function (err) {
        if (err) {
            console.error('Error removing ID 0:', err);
            return;
        }
        console.log('ID 0 has been removed!');
    });
}