export async function main(ns) {
    let price = ns.getPurchasedServerCost(ns.args[0]);
    let number = ns.args[1] || 1;
    let purchase = await ns.prompt("Would you like to purchase " + ns.args[1] + " " + ns.args[0] + "gb server for $" + price * number + "? You currently have $" + ns.getServerMoneyAvailable('home') + ".");
    if (purchase === true) {
        let nameBase = 'Server';
        let nameModifier = Math.floor(Math.random() * 1000000) + 100000;
        let serverName = nameBase.concat("|", ns.args[0], "|", nameModifier);
        if (ns.getServerMoneyAvailable('home') >= price) {
            ns.purchaseServer(serverName, ns.args[0]);
        } else {
            ns.tprint("You do not have the funds to purchase the specified size server.");
        }
    } else {
        ns.tprint("You did not purchase any servers.")
    }


}
