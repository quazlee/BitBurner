let allServers = ["home","foodnstuff","sigma-cosmetics","CSEC","joesguns","hong-fang-tea","zer0","omega-net","netlink","nectar-net","neo-net","silver-helix","rothman-uni","lexo-corp","unitalife","zb-institute","phantasy","the-hub","summit-uni","avmnite-02h","alpha-ent","global-pharm","omnia","univ-energy","run4theh111z","vitalife","microdyne","fulcrumtech","aevum-police","catalyst","rho-construction","I.I.I.I","millenium-fitness","solaris","titan-labs","helios","omnitek","powerhouse-fitness","blade",".","harakiri-sushi","iron-gym","max-hardware"]

export async function main(ns) {
    
    const SECURITY_PERCENT = 0.05; //The percent of a server's security (btwn min + base) the target has to be above to weaken
    const WEAKEN_AMOUNT = 0.05; //Amount of security that weaken lowers by (this should stay constant)

    let target = ns.args[0] || "silver-helix";

    const minSecurity = ns.getServerMinSecurityLevel(target);
    const securityThreshold = (ns.getServerBaseSecurityLevel(target) - minSecurity)*SECURITY_PERCENT + minSecurity;

    const moneyPercent = ns.args[1] || 0.95;
    const moneyThreshold = ns.getServerMaxMoney(target) * moneyPercent;
    
    const growScript = {
        name: "brainGrow.js",
        size: ns.getScriptRam("brainGrow.js"),
        threadsName: "growThreads",
        execTime: 0
    }

    const hackScript = {
        name: "brainHack.js",
        size: ns.getScriptRam("brainHack.js"),
        threadsName: "hackThreads",
        execTime: 0
    }

    const weakenScript = {
        name: "brainWeaken.js",
        size: ns.getScriptRam("brainWeaken.js"),
        threadsName: "weakenThreads",
        execTime: 0
    }

    let scriptSize = getLargestScriptSize(growScript.size, hackScript.size, weakenScript.size);

    allServers.concat(ns.getPurchasedServers());

    const threads = {
        maxThreads: getAvailableThreads(scriptSize, ns),
        totalThreads: getAvailableThreads(scriptSize, ns),
        hackThreads: 0,
        weakenThreads: 0,
        growThreads: 0
    }

    while (true) {

        if (threads.totalThreads > 0) {

            let security = ns.getServerSecurityLevel(target) - threads.weakenThreads * WEAKEN_AMOUNT;
            let money = ns.getServerMoneyAvailable(target);

            let weakens = 0;
            let grows = 0;
            let hacks = 0;

            let availableThreads = threads.totalThreads;

            if (security > securityThreshold) {
                weakens = Math.ceil((security-minSecurity)/WEAKEN_AMOUNT);
                if (weakens > availableThreads) weakens = availableThreads;
                availableThreads -= weakens;
            }
            
            if (availableThreads > 0 && money < moneyThreshold) {

                let growthMultiplier = moneyThreshold/money;
                grows = Math.ceil(ns.growthAnalyze(target, growthMultiplier)) - threads.growThreads;

                if (grows > availableThreads) {
                    grows = Math.floor(availableThreads*(.92));
                    weakens += Math.floor(availableThreads*(.08));
                } else {
                    weakens += Math.ceil(grows/12.5);
                }

                availableThreads = threads.totalThreads - (weakens + grows);

                if (availableThreads < 0) weakens += Math.floor(availableThreads);
            }

            hacks = availableThreads > 0 ? availableThreads : 0;

            deploy(weakenScript, threads, weakens, target, ns);
            deploy(growScript, threads, grows, target, ns);
            deploy(hackScript, threads, hacks, target, ns);

        }

        ns.print("Hack: " + threads.hackThreads)
        ns.print("Grow: " + threads.growThreads)
        ns.print("Weaken: " + threads.weakenThreads)

        await ns.sleep(1000);

    }

}

function getAvailableThreads(scriptRam, ns) {
    let threads = 0;
    for (let i = 0; i < allServers.length; ++i) {
        let serverRam = ns.getServerRam(allServers[i]);
        if (allServers[i] == "home") {
            serverRam[1] += 50;
            if (serverRam[1] > serverRam[0]) serverRam[1] = serverRam[0]
        }
        threads += Math.floor((serverRam[0] - serverRam[1]) / scriptRam);
        
    }
    return threads;
}

function getLargestScriptSize(g, h, w) {
    if (g >= h && g >= w) return g;
    if (h >= g && h >= w) return h;
    return w;
}

function updateExecutionTime(scriptObject, target, ns) {
    if (scriptObject.name == "brainGrow.js") {
        scriptObject.execTime = ns.getGrowTime(target);
    } else if (scriptObject.name == "brainHack.js") {
        scriptObject.execTime = ns.getHackTime(target);
    } else if (scriptObject.name == "brainWeaken.js") {
        scriptObject.execTime = ns.getWeakenTime(target);
    } else {
        throw "Error: Unknown Script Type";
    }
}

function deploy(scriptObject, threadsObject, performThreads, target,  ns){
    let reclaimThreads = performThreads;
    updateExecutionTime(scriptObject, target, ns);

    if(performThreads > threadsObject.totalThreads){
            try {
                throw "There are not enough threads available to perform this action";
            } catch (e){
                ns.print(e);
                return;
            }
    }
    
    threadsObject[scriptObject.threadsName] += performThreads;
    threadsObject.totalThreads -= performThreads;

    if (performThreads > 0){
        for (let i = 0; i < allServers.length; i++) {

            let serverSize = ns.getServerRam(allServers[i])
            if (allServers[i] == "home") {
                serverSize[1] += 50;
                if (serverSize[1] > serverSize[0]) serverSize[1] = serverSize[0]
            }
            let tempThreads = Math.floor(((serverSize[0] - serverSize[1])) / scriptObject.size);

            if (tempThreads == 0) continue;
            if (tempThreads > performThreads) tempThreads = performThreads;
            if (!ns.fileExists(scriptObject.name, allServers[i])) ns.scp(scriptObject.name, "home", allServers[i]);

            ns.exec(scriptObject.name, allServers[i], tempThreads, target);
            performThreads -= tempThreads;

            if (performThreads == 0) break;
        }
    }

    setTimeout( function() {
        threadsObject.totalThreads += reclaimThreads; 
        threadsObject[scriptObject.threadsName] -= reclaimThreads;
    }, (scriptObject.execTime*1000)+10);
}
