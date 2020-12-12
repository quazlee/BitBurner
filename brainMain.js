export async function main(ns){
    var target = ns.args[0];
    var host;
    var scanList = ns.scan();
    var SECURITY_MODIFIER = .4;
    var MONEY_MODIFIER = .5;
    scanList = getServers(scanList, "Server", ns);

    while(true){
        if(((ns.getServerBaseSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) * SECURITY_MODIFIER) + ns.getServerMinSecurityLevel(target)){
            for(let i = 0; 0 < scanList.length; i++){
                ns.killall(scanList[i]);
            }

            let script = "brainHack.js";
            let serverRam = ns.getServerRam(target);
            let scriptRam = ns.getScriptRam(script);
            let threads = (((serverRam[0] - serverRam[1])) / scriptRam) - 1;
            for(let i = 0; 0 < scanList.length; i++){
                ns.exec(script, scanList[i], threads, target);
            }
        } else if(ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * MONEY_MODIFIER){
            for(let i = 0; 0 < scanList.length; i++){
                ns.killall(scanList[i]);
            }
            let script = "brainGrow.js";
            let serverRam = ns.getServerRam(target);
            let scriptRam = ns.getScriptRam(script);
            let threads = (((serverRam[0] - serverRam[1])) / scriptRam) - 1;
            for(let i = 0; 0 < scanList.length; i++){
                ns.exec(script, scanList[i], threads, target);
            }
        } else{
            for(let i = 0; 0 < scanList.length; i++){
                ns.killall(scanList[i]);
            }
            let script = "brainHack.js";
            let scriptRam = ns.getScriptRam(script);
            let threads = ns.hackAnalyzeThreads(target);
            let serverSpace = (((serverRam[0] - serverRam[1])) / scriptRam) - 1;
            for(let i = 0; 0 < scanList.length; i++){
                if (serverSpace > threads){
                    ns.exec(script, scanList[i], threads, target);
                }else{
                    ns.exec(script, scanList[i], serverSpace, target);
                }
            }
        }
            
    }
    
}


function getServers(arr, query, ns){
    return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    })
}
