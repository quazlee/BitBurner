export async function main(ns) {
    let script = ns.args[0];
    let deployTarget = ns.args[1];
    let scriptTarget = ns.args[2];
    let serverRam = ns.getServerRam(deployTarget);
    let scriptRam = ns.getScriptRam(script);
    let threads = Math.floor((serverRam[0] - serverRam[1]) / scriptRam);
    if (!ns.fileExists(script, deployTarget)) {
        ns.scp(script, "home", deployTarget);
    }
    ns.exec(script, deployTarget, threads, scriptTarget);
}
