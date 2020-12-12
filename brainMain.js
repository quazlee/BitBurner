export async function main(ns){
    var target;
    var host;
    var hackThreads;
    var growThreads;
    var weakenThreads;
    var scanList;

    getServers(scanList, Server, ns);

    ns.print(getServers(scanList, Server, ns));

    
}

function serverGrow(ram, ns){
    growThreads = (((ram[0] - serverRam[1])) / scriptRam) - 1;
}

function serverWeaken(ram, ns){
    weakenThreads = (((ram[0] - serverRam[1])) / scriptRam) - 1;
}

function serverHack(ns){

}

function getServers(arr, query, ns){
    arr = ns.scan();
    return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    })
}
