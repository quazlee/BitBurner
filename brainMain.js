export async function main(ns){
    var target;
    var host;
    var scanList = ns.scan;

    scanList = getServers(scanList, "Server", ns);
    ns.tprint(scanList);

    // if((ns.getServerBaseSecurityLevel(target) - ns.getServerMinSecurityLevel(target))*.3 + ns.getServerMinSecurityLevel(target)){

    //     serverWeaken();
    // }

    
}

// function serverGrow(target, host, ns){
//     let script = "brainGrow.js";
//     let serverRam = ns.getServerRam(target);
//     let scriptRam = ns.getScriptRam(script);
//     let threads = (((serverRam[0] - serverRam[1])) / scriptRam) - 1;
//     ns.exec(script, host, threads, target);
// }

// function serverWeaken(ram, ns){
//     let script = "brainHack.js";
//     let serverRam = ns.getServerRam(target);
//     let scriptRam = ns.getScriptRam(script);
//     let threads = (((serverRam[0] - serverRam[1])) / scriptRam) - 1;
// }

// //deploys hacking scripts that obtain a percentage of the total money
// function serverHack(ns){
//     let script = "brainHack.js";

// }

//returns array of player owned servers, excluding home
function getServers(arr, query, ns){
    return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    })
}
