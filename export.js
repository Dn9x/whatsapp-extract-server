const http = require('http');
const flatCache = require('flat-cache');
const path = require('path');
const fs = require('fs');
const url = require('url');
const fpath = path.resolve('./cache/');
const fapath = path.resolve('./cache/all');
console.log(new Date(), '缓存路径是:', fpath);


// 判断号码是否存在
function isHave(mobile) {
    // 这里存储所有的号码
    const cache = flatCache.load('all_mobile', fapath);

    let result = cache.getKey('all');

    if (!result) {
        result = {};
    }
    if (!result[mobile]) {
        result[mobile] = 1;
        cache.setKey('all', result);
        cache.save();
        return false;
    }

    return true;
}

function main() {
    const key = `2023_2_7`;
    const cache = flatCache.load('csv_group_2023_2_7', fpath);
    let result = cache.getKey(key);
    for (let k in result) {
        const t = isHave(k);
        console.log('k: ', k, "   结果: ", t);
    }


    const key2 = `2023_2_2`;
    const cache2 = flatCache.load('csv_group_2023_2_2', fpath);
    let result2 = cache2.getKey(key2);
    for (let k in result2) {
        const t = isHave(k);
        console.log('k: ', k, "   结果: ", t);
    }


    const key3 = `2023_1_31`;
    const cache3 = flatCache.load('csv_group_2023_1_31', fpath);
    let result3 = cache3.getKey(key3);
    for (let k in result3) {
        const t = isHave(k);
        console.log('k: ', k, "   结果: ", t);
    }

    const key4 = `2023_1_5`;
    const cache4 = flatCache.load('csv_group_2023_1_5', fpath);
    let result4 = cache4.getKey(key4);
    for (let k in result4) {
        const t = isHave(k);
        console.log('k: ', k, "   结果: ", t);
    }

    const key5 = `2022_12_23`;
    const cache5 = flatCache.load('csv_group_2022_12_23', fpath);
    let result5 = cache5.getKey(key5);
    for (let k in result5) {
        const t = isHave(k);
        console.log('k: ', k, "   结果: ", t);
    }
}

main();