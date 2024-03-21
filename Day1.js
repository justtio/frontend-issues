//localStorage和sessionStorage能像cookie一样手动设置过期时间吗？

// localStorage和sessionStorage本身不支持设置过期时间。
// localStorage的数据会一直保留，直到手动删除或者用户清理浏览器数据
// sessionStorage的数据则会在浏览器窗口或标签页关闭时自动删除

// 但是我们可以手动实现过期时间的功能，比如：
// 存储数据的时候，存储一个过期时间，取数据的时候判断是否过期
// 如果过期了，就删除数据

// 代码如下：
const expiredTime = new Date().getTime() + 60 * 60 * 1000;
localStorage.setItem('key', JSON.stringify({value: 'data', expire: expiredTime}));

const data = JSON.parse(localStorage.getItem('key'));

if(data) {
    if(new Date().getTime() > data.expire) {
        localStorage.removeItem('key');
    } else {
        console.log(data.value);
    }
}


// new操作符做了什么？

// 1. 创建一个空对象
// 2. 将这个空对象的原型指向构造函数的prototype
// 3. 将这个空对象作为this的上下文
// 4. 如果构造函数没有返回对象，就返回this

// 代码如下：
function myNew() {
    const obj = {};
    const Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    const result = Constructor.apply(obj, arguments);
    return result instanceof Object ? result : obj;
}

// 使用方法如下：
function Person(name) {
    this.name = name;
}

const person = myNew(Person, 'Tom');

//DNS解析的过程

// DNS解析是将域名解析成IP地址的过程，主要分为以下几个步骤：
// 1. 用户在浏览器中输入一个域名，比如www.baidu.com
// 2. 操作系统首先会检查本地缓存中是否有该域名对应的IP地址，如果有，就直接返回
// 3. 如果本地缓存中没有，就会向本地配置的DNS服务器发送一个DNS查询请求
// 4. DNS服务器收到请求后，如果自己有缓存，就直接返回
// 5. 如果没有，就会向根域名服务器发送请求
// 6. 根域名服务器收到请求后，会返回一个顶级域名服务器的地址
// 7. DNS服务器再向顶级域名服务器发送请求
// 8. 顶级域名服务器收到请求后，会返回一个二级域名服务器的地址
// 9. DNS服务器再向二级域名服务器发送请求
// 10. 二级域名服务器收到请求后，会返回一个IP地址
// 11. DNS服务器最后将IP地址返回给操作系统
// 12. 操作系统将IP地址缓存起来，并返回给浏览器
// 13. 浏览器拿到IP地址后，就可以向该IP地址发送请求了

// 代码如下：
// www.baidu.com ->
// 本地缓存 -> 本地DNS服务器 -> 根域名服务器 -> 顶级域名服务器 -> 二级域名服务器 -> IP地址


// 写一个完备的深拷贝函数
function deepClone(obj, hash = new WeakMap()) {
    if(obj === null) return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    if(typeof obj !== 'object') return obj;
    if(hash.has(obj)) return hash.get(obj);

    let cloneObj = new obj.constructor;
    hash.set(obj, cloneObj);

    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], hash);
        }
    }

    return cloneObj;
}
