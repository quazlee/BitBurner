export async function main(ns) {
	let target = ns.args[0];

	const SECURITY_PERCENT = 0.5; //The percent of a server's security (btwn min + base) the target has to be above to weaken

	const minSecurity = ns.getServerMinSecurityLevel(target)
	const securityThreshold = (ns.getServerBaseSecurityLevel(target) - minSecurity)*SECURITY_PERCENT + minSecurity;
	
	let moneyThreshold = ns.getServerMoneyAvailable(target);

	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThreshold) {
			
			await ns.weaken(target);
			
	    	} else if (ns.getServerMoneyAvailable(target) > moneyThreshold) {
			
			moneyThreshold *= 1.001;
			await ns.hack(target);
			
	    	} else {
		
			await ns.grow(target);
			
	    	}
	}
}
