// async function asyncFunction() {
//   console.log('开始'); // 同步执行
//   const result = await new Promise(resolve => {
//     setTimeout(() => resolve('异步结果'), 1000);
//   });
//   console.log(result); // 等待 Promise 完成后执行
//   console.log('结束');
// }

// asyncFunction();
// console.log('外部代码'); // 同步执行，不会等待 asyncFunction 完成

// // 输出顺序：
// // 开始
// // 外部代码
// // 异步结果
// // 结束

// console.log('1. 同步代码开始');

// // 宏任务
// setTimeout(() => {
//   console.log('4. 宏任务执行');
// }, 0);

// // 微任务
// Promise.resolve().then(() => {
//   console.log('3. 微任务执行');
// });

// console.log('2. 同步代码结束');

// console.log('1. 同步代码');

// setTimeout(() => {
//   console.log('4. 宏任务1');
//   Promise.resolve().then(() => {
//     console.log('5. 宏任务1内的微任务');
//   });
// }, 0);

// Promise.resolve().then(() => {
//   console.log('2. 微任务1');
//   Promise.resolve().then(() => {
//     console.log('3. 微任务2');
//   });
// });

async function example() {
  console.log('1. 开始');
  let result = await new Promise(resolve => setTimeout(() => resolve('3. 异步结果'), 1000));
  console.log(result); // 等待 Promise 完成后执行
  console.log('4. 结束'); // 这是微任务
}

example();
console.log('2. 外部代码');