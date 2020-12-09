export async function main(ns) {
	let target = ns.args[0];
    
  const MONEY_PERCENT = 0.8; //The percent of a server's max money the target has to be above in order to hack
  const SECURITY_PERCENT = 0.5; //The percent of a server's security (btwn min + base) the target has to be above to weaken
  
  const minSecurity = ns.getServerMinSecurityLevel(target)
  const securityThreshold = (ns.getServerBaseSecurityLevel(target) - minSecurity)*SECURITY_PERCENT + minSecurity;
  
  while (true) {
  	if (ns.getServerSecurityLevel(target) > securityThreshold) {
    	do {
				await ns.weaken(target);
			} while (ns.getServerSecurityLevel(target) > minSecurity + 0.2);     
    }else if (ns.getServerMoneyAvailable(target) > (ns.getServerMaxMoney(target))*MONEY_PERCENT){
    	await ns.hack(target);
    } else {
    	await ns.grow(target);
    }
  }
}