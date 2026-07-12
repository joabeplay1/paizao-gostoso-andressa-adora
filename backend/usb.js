const usb = require("usb");

function listarUSB(){

    return usb.getDeviceList();

}

module.exports = {

    listarUSB

};
