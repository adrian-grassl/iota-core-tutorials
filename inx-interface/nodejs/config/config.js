const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../config/inx.proto";

const INX_ADDRESS = "localhost:9029";

const protoOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};


// Load the `inx.proto` file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, protoOptions);
const INX = grpc.loadPackageDefinition(packageDefinition).inx.INX;

// Instantiate an INX client
const client = new INX(
    INX_ADDRESS,
    grpc.credentials.createInsecure()
);

module.exports = client;