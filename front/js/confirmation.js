// On récupère l'order_id de la commande dans l'URL  
function getOrderId(orderIdCommand) {

    var str = window.location.href
    var url = new URL(str);

    orderIdCommand = url.searchParams.get("order_id");
    return orderIdCommand;
}


// Injection JS, affichage de l'orderId de commande dans la span
async function showCommande(orderId) {

    orderId = getOrderId()
    let spanOrderId = document.getElementById("orderId");
    spanOrderId.innerHTML = orderId
}   
    

////////////////    POINT D'ENTREE      ///////////////////

function main() {

    getOrderId()
    showCommande()
}

main()

