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


