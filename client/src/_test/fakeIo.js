export default function () {
    var io = {
        _connectedTo: undefined,
        connect: function (url) {
            io._connectedTo = url;
            return { // socket
                on: function (eventName) {

                }
            }
        }
    };
    return io;
};