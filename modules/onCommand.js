var http = require('http');
var qs = require('querystring');


function onCommand(bot, args){
    args.t = args.t.substring(1);

    var message = args.t.split(' ');
    switch(message[0]){

        case 'say':
            delete message[0];
            message = message.join(' ').trim();
            if(message.charAt(0) != '/')
                bot.sendMessageAutoDetection(args.u, message, args.type);
            else
                bot.sendMessageAutoDetection(args.u, 'Nope.', args.type);
        break;

        case 'debug':
            console.log(bot.packets.y.p);
        break;

        case 'xavi':
            switch (message[1]) {
                case 'stole':
                        var id = message[2];

                        //Get the xavi.
                        http.get({
                            host: 'xat.com',
                            path: '/json/xavi/get.php?u=' + id
                        }, function(response) {
                            response.setEncoding('utf8');
                            var body = '';

                            response.on('data', function(d) {
                                body += d;
                            });

                            response.on('end', function() {

                                console.log(body);

                                //Update the bot xavi.
                                var postData = qs.stringify({
                                    's' : 60,
                                    'au' : 'undefined',
                                    't' : bot.packets.y.t,
                                    'j' : 'undefined',
                                    'u' : bot.config.xatid,
                                    'k' : bot.packets.y.I,
                                    'v' : 'undefined',
                                    'i' : bot.packets.y.i,
                                    'xavi' : body
                                });

                                var options = {
                                    hostname: 'xat.com',
                                    port: 80,
                                    path: '/json/xavi/put.php',
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Content-Length': postData.length
                                    }
                                };

                                var req = http.request(options, function(res) {
                                    res.setEncoding('utf8');

                                    res.on('data', function (chunk) {
                                        console.log('BODY: ' + chunk);
                                    });
                                });

                                req.on('error', function(e) {
                                    console.log('problem with request: ' + e.message);
                                });

                                // write data to request body
                                req.write(postData);
                                req.end();
                            });
                        });

                    break;
                default:

            }
        break;
    }
}

module.exports = onCommand;
