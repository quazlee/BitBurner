export async function main(ns) {
	let target = ns.args[0];
    
  const MONEY_PERCENT = 0.8; //The percent of a server's max money the target has to be above in order to hack
  const SECURITY_PERCENT = 0.5; //The percent of a server's security (btwn min + base) the target has to be above to weaken
  
  const securityThreshold = (ns.getServerBaseSecurityLevel(target) - ns.getServerMinSecurityLevel(target))*SECURITY_PERCENT + ns.getServerMinSecurityLevel(target);
  
  while (true) {
  	if (ns.getServerSecurityLevel(target) > securityThreshold) {
    	await ns.weaken(target);
    }else if (ns.getServerMoneyAvailable(target) > (ns.getServerMaxMoney(target))*MONEY_PERCENT){
    	await ns.hack(target);
    } else {
    	await ns.grow(target);
    }
  }
}