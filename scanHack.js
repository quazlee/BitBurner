export async function main(ns) {
    let scanList;
    let mapList;
    let numPortsOpen = 0;
    let counter = 0;
    scanList = [];
    buildScanList(scanList, "home", "", ns)
    scanList.splice(0, 1);

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

    let script = "serverHack.js";

    scanList.map(x => (ns.getServerNumPortsRequired(x) <= numPortsOpen) ? ns.nuke(x) : {});
    scanList.map(function(x) {
        if (ns.hasRootAccess(x)) {
            counter++;
             
            let target = x;

            ns.scp(script, "home", target);
            
            let serverRam = ns.getServerRam(target);
            let scriptRam = ns.getScriptRam(script);
            let threads = (((serverRam[0] - serverRam[1])) / scriptRam) - 1;
            
            if (threads > 0 && ns.getHackingLevel() > ns.getServerRequiredHackingLevel(x)) {
                ns.exec(script, target, threads, target);
            }
        }

    })
    // ns.tail();
    ns.tprint(counter);
}

function buildScanList(scanList, node, parent, ns) {

    let children = ns.scan(node);
    scanList.push(node);


    for (let i = 0; i < children.length; i++) {
        if (children[i] != parent) buildScanList(scanList, children[i], node, ns);
    }
}
