// If you want to debug the httpclient requests, just need to add below code to config.local.js:
// module.exports = () => {
//     const config = {};

//     // add http_proxy to httpclient
//     // if (process.env.http_proxy) {
//     config.httpclient = {
//         request: {
//             enableProxy: true,
//             rejectUnauthorized: false,
//             proxy: 'http://127.0.0.1:1080',
//         },
//     };
//     // }
//     console.log(config)
//     return config;
// }

exports.httpclient = {
    request: {
        enableProxy: true,
        rejectUnauthorized: false,
        proxy: 'http://127.0.0.1:1080',
    },
};

exports.robot = {
    ua: [
        /Baiduspider/i,
    ],
};