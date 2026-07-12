const adb = require("adbkit");

const client = adb.createClient();

async function listarDispositivos() {

    try {

        const devices = await client.listDevices();

        return devices;

    } catch (e) {

        console.log(e);

        return [];

    }

}

async function obterInformacoes(id) {

    try {

        const fabricante = await client.shell(id,"getprop ro.product.manufacturer");
        const modelo = await client.shell(id,"getprop ro.product.model");
        const android = await client.shell(id,"getprop ro.build.version.release");

        return {
            fabricante,
            modelo,
            android
        };

    } catch(e){

        console.log(e);

        return null;

    }

}

module.exports = {

    listarDispositivos,

    obterInformacoes

};
