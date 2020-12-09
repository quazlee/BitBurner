export async function main(ns) {
    let scanList;
    let mapList;
    let numPortsOpen = 0;
    scanList = [];
    buildScanList(scanList, "home", "", ns)
    ns.tprint(scanList);

    if (ns.fileExists('BruteSSH.exe')) {
        scanList.map(x => ns.brutessh(x));
        numPortsOpen++;
    }

    if (ns.fileExists('FTPCrack.exe')) {
        scanList.map(x => ns.ftpcrack(x));
        numPortsOpen++;
    }

    if (ns.fileExists('relaySMTP.exe')) {
        scanList.map(x => ns.relaysmtp(x));
        numPortsOpen++;
    }

    if (ns.fileExists('HTTPWorm.exe')) {
        scanList.map(x => ns.httpworm(x));
        numPortsOpen++;
    }

    if (ns.fileExists('SQLInject.exe')) {
        scanList.map(x => ns.sqlinject(x));
        numPortsOpen++;
    }

    scanList.map(x => (ns.getServerNumPortsRequired(x) <= numPortsOpen) ? ns.nuke(x) : {});
}

function buildScanList(scanList, node, parent, ns) {

    let children = ns.scan(node);
    scanList.push(node);


    for (let i = 0; i < children.length; i++) {
        if (children[i] != parent) buildScanList(scanList, children[i], node, ns);
    }
}