export async function main(ns) {
    let scanList;
    let mapList;
    
    scanList = [];
    buildScanList(scanList, "home", "", ns)
    ns.tprint(scanList);
    
    if (ns.fileExists('BruteSSH.exe')) {
        scanList.map(x => ns.brutessh(x));
    }
    
    if (ns.fileExists('FTPCrack.exe')) {
        scanList.map(x => ns.ftpcrack(x));
    }
    
    if (ns.fileExists('relaySMTP.exe')) {
        scanList.map(x => ns.relaysmtp(x));
    }
    
    if (ns.fileExists('HTTPWorm.exe')) {
        scanList.map(x => ns.httpworm(x));
    }
    
    if (ns.fileExists('SQLInject.exe')) {
        scanList.map(x => ns.sqlinject(x));
    }
    
    scanList.map(x => ns.nuke(x));
}

function buildScanList(scanList, node, parent, ns) {

	let children = ns.scan(node);
  scanList.push(node);
  
  
	for (let i = 0; i < children.length; i++) {
  	if (children[i] != parent) buildScanList(scanList, children[i], node, ns);
  }
}