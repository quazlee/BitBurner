export async function main(ns){
    let maxSize = Math.log2(ns.getPurchasedServerMaxRam());
    for(let i = 1; i < maxSize+1; i++){
        ns.tprint(Math.pow(2,i) + ' gb costs '  + ns.nFormat(ns.getPurchasedServerCost(Math.pow(2,i)), "$0.000a"));
    }
}