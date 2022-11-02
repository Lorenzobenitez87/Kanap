//////////////////////      FETCH     ///////////////////

// Fonction qui récupère L'id du produit consulté dans l'url methode searchParams.get.
function getId() {

    var str = window.location.href;
    var url = new URL(str);
    let id = url.searchParams.get("id");
    return id;
}


// On fait une requète à l'API sur les infos que contient le produit consulté à l'aide de son id.
const fetchKanap = async (url, id) => {

    // Contrôle de l'id si égale à null ou vide ou incorrect on masque la section
    if (id == null || id == "" || !id) {
        // Message d'erreur pour l'utilisateur et la console
        showMessageForUser("Merci de revenir plus tard", "fetchKanap", "erreur au niveau du back");
        return;
    } 

    // Action on attend la reponse, qui sera traité par json(), avant d'être exécuté dans 
    // la fonction showProduit
    await fetch(url + id)

        .then((Response) => Response.json())
        .then((Promise) => {
            showProduit(Promise);
        })

        // Si pas de reponse de l'API, Message d'erreur pour l'utilisateur et la console
        .catch((e) => {
            showMessageForUser("Merci de revenir plus tard", "fetchKanap", "erreur au niveau du back");
            return;
        })
}


// Fonction injection JS des informations du produit consulté. 
//
function showProduit(produit) {

    //déclaration
    let img = document.createElement("img");

    //initiation
    document.querySelector(".item__img").appendChild(img);
    //contrôle variable produit
    if (produit == null) {
        //message à l'utilisateur et à la console
        showMessageForUser("Merci de revenir plus tard", "showProduit", "la variable produit est vide");
        return;
    }
    
    //action injection JS descriptif produit
    document.title = produit.name;
    document.getElementById("title").innerHTML = produit.name;
    img.setAttribute("src", produit.imageUrl);
    img.setAttribute("alt", produit.altTxt);
    document.getElementById("price").innerHTML = produit.price;
    document.getElementById("description").innerHTML = produit.description;

    
    let select = document.getElementById("colors");
    // On fait une boucle pour afficher les couleurs du Tableau product.colors
    // dans les valeurs selectionnables en options
    produit.colors.forEach((color) => {
        let option = document.createElement("option");
        option.value = color;
        option.innerHTML = color;
        select.appendChild(option);
    });
}


////* Fonction Ajouter au panier, on créer un objet contenant l'id, la couleur et la quantité d'un produit.//
// On verifie si une couleur et une quantitée ont bien été selectionné.//////////////////////////////////////
// On vérifie si il éxiste un produit dans l'objet avec la même id et couleur au quel cas on ne change///////
// que la quantité de celui-ci sinon on ajoute une instance. Contrôle pas plus de 100 produits. *////////////
function addBasket() {

    // On récupère la clef produit dans le local storage puis traiter par JSON.parse
    let productBoard = JSON.parse(localStorage.getItem("produit"));
    // Déclaration 
    let select = document.getElementById("colors");
    let input = document.getElementById("quantity");

    // Assigner id, color et quantity à un objet : créer un objet pour l'envoyer dans le panier
    const fusionProduitColor = Object.assign({}, {
        id: getId(),
        color: select.value,
        quantity: input.value,
    });

    // Contrôle quantité compris entre 1 et 100 et la selection d'une couleur.
    if (input.value > 100) {
        input.value = 100  
      return 
    }
    if (input.value == 0) {
        alert("Veuillez selectionner une quantitée pour continuer");
        return false
    }
    if (select.value == "") {
        alert("Veuillez selectionner une couleur pour continuer");
        return false
    } 

    if (productBoard == null) {
        productBoard = [];
        productBoard.push(fusionProduitColor);
        // On met l'objet fusionProduitColor dans le tableau productBoard

    } else if (productBoard != null) {
        // Si le produit est présent ! On boucle sur le productBoard pour vérifier si il y en a avec le même
        // id et la même couleur, si c'est le cas on ne change que la quantité sinon on creer 
        // une nouvelle instance. Contrôle: On ne peut pas ajouter plus de 100 produits.
        let productFind = false;
        productBoard.forEach(productls => {
            if (productls.id == fusionProduitColor.id &&
                productls.color == fusionProduitColor.color) {
                productFind = true;
                let newQuantity = parseInt(fusionProduitColor.quantity) + parseInt(productls.quantity);
                newQuantity = newQuantity > 100 ? 100 : newQuantity;
                productls.quantity = newQuantity;
            }
        });
        if (!productFind) {
            productBoard.push(fusionProduitColor);
        }
    }

    // On envoie dans le local storage en créant clef = produit ; valeur = productBoard
    localStorage.setItem("produit", JSON.stringify(productBoard));
    return (productBoard = JSON.parse(localStorage.getItem("produit")));
}


// Fonction qui gère les messages utilisateur et indique au dev d'où vient le problème rencontré.
function showMessageForUser(messageUser, fonction, messageDev) {
    document.getElementsByClassName("item")[0].innerHTML = messageUser;
    console.log(fonction + " : " + messageDev);
}


////////////////    POINT D'ENTREE      ///////////////////

function main() {

    //récupération de l'id 
    let id = getId();

    // on requète l'API avec fetch, on demande les infos du produit ayant l'id récupéré.
   
    let url = "http://localhost:3000/api/products/";
    fetchKanap(url, id);

    //Le click au bouton ajouter au panier éxécute la fonction addBasket
    let bouton = document.getElementById('addToCart');
    bouton.addEventListener("click", addBasket);

}

main();

