const http = require('http');
const flatCache = require('flat-cache');
const path = require('path');
const fs = require('fs');
const url = require('url');
const fpath = path.resolve('./cache/');
console.log('缓存路径是:', fpath);
const cache = flatCache.load('csv_group', fpath);

// 数据存储到本地
function saveData(data) {
    const date = new Date();
    const key = `${date.getFullYear()}_${date.getMonth()}_${date.getDay()}`;

    let result = cache.getKey(key);
    console.log(typeof data);

    try {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
    } catch (e) {
        return `data不是json格式数据入库失败`;
    }

    if (!result) {
        result = {};
    }

    let count = 0;
    let news = 0;
    let old = 0;
    for (let key in data) {
        count++;
        const it = data[key];

        if (!result[key]) {
            news++;
            result[key] = it;
        } else {
            old++;
            result[key] = it;
        }
    }

    let total = 0;
    for (let k in result) {
        total++;
    }
    const str = `数据保存成功, 今天已经存入${total}条数据，本次共: ${count}条数据, 新增${news}条数据, 更新${old}条数据`;
    cache.setKey(key, result);
    cache.save();

    console.log(str);
    return str;
}

// 导出数据
function exportData() {
}

// 导出今天数据
function exportTodayData() {
    const date = new Date();
    const key = `${date.getFullYear()}_${date.getMonth()}_${date.getDay()}`;

    let result = cache.getKey(key);
    const filename = `${key}_${new Date().getTime()}.csv`;
    const filepath = path.resolve(`./csv/${filename}`);

    fs.appendFileSync(filepath, '组名,号码,时间\n');
    let time = new Date().toLocaleString();
    time = time?.replace(', ', ' ')
    for (var k in result) {
        var it = result[k];
        const csv = it + "," + k + "," + time + "\n";
        fs.appendFileSync(filepath, csv);
    }

    console.log('数据导出完成，文件地址是: ' + filepath);
    return `http://localhost:8000/export/csv?name=${filename}`;
}

// Create a local server to receive data from
const server = http.createServer((req, res) => {
    console.log(` ${new Date()} url: ${req.url} `);

    let str = '';
    if (req.url == '/api/group/contact') {
        const chunks = [];
        req.on("data", (chunk) => {
            chunks.push(chunk);
        });
        req.on("end", () => {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            str = saveData(stringData);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(str);
        });
    } else if (req.url == '/api/group/export/today') {
        str = exportTodayData();

        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(str);
    } else if (req.url == '/api/group/export/all') {
        exportData();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(str);
    } else if (req.url?.indexOf('/export/csv') != -1) {
        const query = url.parse(req.url, true).query;
        console.log('name:', query?.name);
        const filepath = path.resolve(`./csv/${query?.name}`);
        fs.readFile(filepath, function (err, data) {
            if (err) {
                return res.end('文件不存在');
            }
            res.statusCode = 200;
            res.setHeader('Content-Description', 'File Transfer');
            res.setHeader('Content-Type', 'application/octet-stream');
            // res.setHeader('Content-Type', 'application/force-download'); // only if really needed
            res.setHeader('Content-Disposition', 'attachment; filename=' + query?.name);
            res.write(data);
            return res.end();
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Hello World!');
    }

});

server.listen(8000, () => {
    console.log('服务已经启动在8000');
});