const client = require("../config/config.js");


// Listen to the stream of latest milestones
var call = client.ReadUnspentOutputs();
call.on('data', function (answer) {
    console.log(answer);
});
call.on('end', function () {
    // The server has finished sending
});
call.on('error', function (error) {
    // An error has occurred and the stream has been closed.
});
call.on('status', function (status) {
    // process status
});