////////////    AFFICHAGE DES PRODUITS  ////////////

// On crée deux constante, une pour les produit de l'API et une pour les produit sélectionné dans le local storage
let PRODUCTS_API;
let PRODUCTS_LS;


// On récupère le tableau des infos produits envoyé dans le local storage depuis la  page produit. 
function getProductsFromLS() {
    PRODUCTS_LS = JSON.parse(localStorage.getItem("produit"));
}


// On requète l'API sur tous les produits.
function getProductsFromAPI(url) {

    fetch(url)
        .then((Response) => Response.json())
        .then((Promise) => {
            PRODUCTS_API = Promise;
            showCarts();
        })
        .catch((e) => {
            showMessageForUser("Merci de revenir plus tard", "getProductsFromAPI", "erreur au niveau du back");
        });
}


// On compare les id du local storage dans une boucle sur les produits de l'API et on ne retourne que 
// les produits qui match.
function getProductFromPRODUCT_API(id) {

    for (let product of PRODUCTS_API) {
        if (product._id == id) {
            return product;
        }
    }
}


// On supprime le produit sélectionné en récuperant ceux qui n'ont pas le même id et la même couleur
// dans une boucle sur les produits du local storage. On rafraichi la page ensuite.
function deleteInLS(id, color) {

    let productFind
    let productBoard = JSON.parse(localStorage.getItem("produit"));

    if (productBoard.length == 1) {
        return (
            localStorage.removeItem("produit")
        )
    } else {
        productFind = productBoard.filter((el) => {
            if (id != el.id || color != el.color) {
                return true;
            }
        })
    }

    localStorage.setItem("produit", JSON.stringify(productFind))
    location.href = "./cart.html"
    return;
}


// Fonction du calcule du total des prix des produits dans le panier.
function showTotalPrice() {

    let products = PRODUCTS_LS
    let totalPrice = 0;
    for (let product of products) {
        totalPrice += product.quantity * getProductFromPRODUCT_API(product.id).price;
    }
    document.getElementById('totalPrice').innerHTML = totalPrice;
}


// Fonction du calcule du nombre de produit dans le panier.
function showTotalProduct() {
    //boucle sur  PRODUCTS_LS
    let products = PRODUCTS_LS
    let totalProduct = 0;
    for (let product of products) {
        totalProduct += parseInt(product.quantity);
    }
    document.getElementById('totalQuantity').innerHTML = totalProduct;
}


// On fait une boucle sur les produits du locale storage, appel des fonctions totaux des 
// quantités produits et des prix produits.
function showCarts() {

    //action: on fait boucle sur PRODUCTS_LS pour afficher les infos des produits du LS avec showcart
    PRODUCTS_LS.forEach(cart => {
        showCart(cart);
    });

    // Appel de la fonction qui totalise les prix des produits et leurs quantités
    showTotalPrice();
    showTotalProduct();
}


// On ne retourne que les produits du local storage dans la requète de l'API en comparant l'id 
// dans une boucle sur les produits de l'API.
function getDataFromBack(id) {

    let ProductFind = [];
    PRODUCTS_API.forEach(product => {
        if (product._id == id) {
            ProductFind = product;
        }
    });
    return ProductFind;
}


// On inject en JS l'affichage des produits dans le local storage.
function showCart(cartLS) {

    cartAPI = getDataFromBack(cartLS.id);

    // déclaration
    let article = document.createElement("article");
    let div_img = document.createElement("div");
    let img = document.createElement("img");
    let div_cart_item_content = document.createElement("div");
    let div_cart_item_content_description = document.createElement("div");
    let h2 = document.createElement("h2");
    let p_color = document.createElement("p");
    let p_price = document.createElement("p");
    let div_cart_item_content_settings = document.createElement("div");
    let div_cart_item_content_settings_quantity = document.createElement("div");
    let p_quantity = document.createElement("p");
    let input = document.createElement("input");
    let div_cart_item_content_settings_delete = document.createElement("div");
    let p_deleteItem = document.createElement("p");

    //initiation: structure de l'injection JS
    document.getElementById("cart__items").appendChild(article);
    article.appendChild(div_img);
    div_img.appendChild(img);
    article.appendChild(div_cart_item_content);
    div_cart_item_content.appendChild(div_cart_item_content_description);
    div_cart_item_content.appendChild(div_cart_item_content_settings);
    div_cart_item_content_description.appendChild(h2);
    div_cart_item_content_description.appendChild(p_color);
    div_cart_item_content_description.appendChild(p_price);
    div_cart_item_content_settings.appendChild(div_cart_item_content_settings_quantity);
    div_cart_item_content_settings.appendChild(div_cart_item_content_settings_delete);
    div_cart_item_content_settings_quantity.appendChild(p_quantity);
    div_cart_item_content_settings_quantity.appendChild(input);
    div_cart_item_content_settings_delete.appendChild(p_deleteItem);

    //action
    article.classList.add("cart__item");
    article.setAttribute("data-id", cartLS.id);
    article.setAttribute("data-color", cartLS.color);
    div_img.classList.add("cart__item__img");
    img.setAttribute("src", cartAPI.imageUrl);
    img.setAttribute("alt", cartAPI.altTxt);
    div_cart_item_content.classList.add("cart__item__content");
    div_cart_item_content_description.classList.add("cart__item__content__description");
    h2.innerHTML = cartAPI.name;
    p_color.innerHTML = cartLS.color;
    p_price.innerHTML = cartAPI.price;
    div_cart_item_content_settings.classList.add("cart__item__content__settings");
    div_cart_item_content_settings_quantity.classList.add("cart__item__content__settings__quantity");
    input.type = "number";
    input.classList.add("itemQuantity");
    input.name = "itemQuantity";
    input.min = 1;
    input.max = 100;
    input.setAttribute("value", cartLS.quantity);
    // propriété onchange qui appel la changeQuantity delete à l'écoute de l'input.
    input.setAttribute("onchange", "changeQuantity('" + cartLS.id + "','" + cartLS.color + "',this)")

    p_quantity.innerHTML = (`Qté : `);

    div_cart_item_content_settings_delete.classList.add("cart__item__content__settings__delete");
    p_deleteItem.classList.add("deleteItem");
    p_deleteItem.innerHTML = ("Supprimer");
        // propriété onclick qui appel la fonction deleteInLS à l'écoute de l'input.
    p_deleteItem.setAttribute("onclick", "deleteInLS('" + cartLS.id + "','" + cartLS.color + "')")
}


// Fonction qui gère les messages utilisateurs et indique au dev d'où vient le problème dans la console.
function showMessageForUser(messageUser, fonction, messageDev) {
    document.getElementById("cart__items").innerHTML = messageUser;
    console.log(fonction + " : " + messageDev);
}


// Fonction qui vérifie s'il y a un produit dans le panier sinon elle fait disparaître le 
// formulaire et indique à l'utilisateur et au dev que le panier est vide.
function checkIfDataInCart() {

    let div_form = document.getElementsByClassName('cart__order')
    let cart__price = document.getElementsByClassName('cart__price')

    if (PRODUCTS_LS == null) {

        div_form[0].style.display = "none";
        console.log("PRODUCTS_LS vide: panier vide");
        cart__price[0].innerHTML = "Le panier est vide";
        return false;
    }
    return true;
}


// Fonction qui controle la quantitée de l'élément augmenter ou diminuer en bouclant sur 
// les produits du local storage et comparant l'id et la couleur des produits, elle change la quantitée 
// de l'élément écouté, controle de la quantitée: pas plus de 100 produits.
function changeQuantity(id, color, element) {

    if (element.value > 100) {
        element.value = 100;
    }

    let productBoard = JSON.parse(localStorage.getItem("produit"));
    productBoard.forEach(productls => {
        if (productls.id == id &&
            productls.color == color) {
            productls.quantity = element.value;
        }
    });
    localStorage.setItem("produit", JSON.stringify(productBoard));

    // appel des fonctions qui gère les totaux prix et quantité produits
    // et les infos des produits dans le local storage
    getProductsFromLS();
    showTotalPrice();
    showTotalProduct();
}


////////////////    POINT D'ENTREE      ///////////////////


// Fonction d'entrée gestion du formulaire, requète des produits du LS dans l'API et confirmation de commande.
function main() {

    let url = "http://localhost:3000/api/products/";
    getProductsFromLS();
    // Contrôle si le panier est vide, on retire le formulaire.
    if (!checkIfDataInCart()) return;
    // On requète l'API que l'id des produits dans le local storage.
    getProductsFromAPI(url);
    // Ecoute et verife dynamique des inputs dans le formulaire. 
    CheckFirstNameDynamic();
    CheckLastNameDynamic();
    CheckAddressDynamic();
    CheckCityDynamic();
    CheckEmailDynamic();
    // A la soumission du formulaire au click sur commande, Controle regex, si ok requète POST à l'API. 
    AddEventToButton();
}

main()


////////////    CONFIRMATION PANIER     /////////////////////


// Fonction au click sur commander on éxécute la confirmation via la fonction confirmer.
function AddEventToButton() {

    const btn = document.getElementById("order");
    btn.addEventListener("click", function (e) {
        confirmer();     
    });
}


// Contrôle des valeurs du formulaire, si ok, envoi des données au back et récupération du numéro 
// de commande (orderId).
function confirmer() {
    
    //récupération des valeurs du formulaire pour les mettre dans le local storage  
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const email = document.getElementById("email").value;
    
    // controle des valeurs du formulaire
    if (!CheckFirstName(firstName) || !CheckLastName(lastName) || !CheckAddress(address) ||
    !CheckCity(city) || !CheckEmail(email)) {
        alert("Merci de remplir le formulaire correctement");
        return
    } else {
        
        // Mettre dans un objet les values du formulaire et l'id des produits commandés
        let commandeFinal = PRODUCTS_LS
        let commandeId = [];
        commandeFinal.forEach((commande) => {
            commandeId.push(commande.id)
        })
        
        const data = {
            contact: {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                email: email
            },
            products: commandeId,
        }
          
        /////////////////     FETCH POST      ///////////////////////////
        // envoi des données au back et récupération du numéro de commande
        
        
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(function (res) {
            if (res.ok) {
                location.href = "./confirmation.html.order_id=" + res;
                return res.json()
            }
        })
        
        .then((promise) => {
            localStorage.clear();
            location.href = "./confirmation.html?order_id=" + promise.orderId;
            return
        })
        .catch((error) => {
            return res.status(500).json(new Error(error))
        }) 
    }
}

// Contrôle dynamique de l'écoute à l'input prénom.
function CheckFirstNameDynamic() {

    const firstName = document.getElementById("firstName");
    firstName.addEventListener("input", function (e) {
        CheckFirstName(e.target.value);
    });
}


// Contrôle dynamique de l'écoute à l'input nom.
function CheckLastNameDynamic() {

    const lastName = document.getElementById("lastName");
    lastName.addEventListener("input", function (e) {
        CheckLastName(e.target.value);
    });
}


// Contrôle dynamique de l'écoute à l'input adresse.
function CheckAddressDynamic() {

    const address = document.getElementById("address");
    address.addEventListener("input", function (e) {
        CheckAddress(e.target.value);
    });
}


// Contrôle dynamique de l'écoute à l'input ville.
function CheckCityDynamic() {

    const city = document.getElementById("city");
    city.addEventListener("input", function (e) {
        CheckCity(e.target.value);
    });
}


// Contrôle dynamique de l'écoute à l'input email.
function CheckEmailDynamic() {

    const email = document.getElementById("email");
    email.addEventListener("input", function (e) {
        CheckEmail(e.target.value);
    });
}


// Contrôle de l'écoute à l'input: le prénom ne doit pas être vide, avoir entre 2 et 25 caractères
// et comporter que des minuscules/majuscules.
function CheckFirstName(data) {

    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
    let msg = "";
    firstNameErrorMsg.innerHTML = "";

    if (data.length == 0) {
        msg = "Merci de saisir une valeur";
        console.log(msg);
        firstNameErrorMsg.innerHTML = msg;
        return false;
    }

    if (data.length < 2 || data.length > 25) {
        msg = "Le prénom doit contenir entre 2 et 25 caractères";
        console.log(msg);
        firstNameErrorMsg.innerHTML = msg;
        return false;
    }

    if (!data.match(/^[a-z A-Z]{2,25}$/)) {
        msg = "Des caractères sont incorrects";
        console.log(msg);
        firstNameErrorMsg.innerHTML = msg;
        return false;
    }
    return true;
}


// Contrôle de l'écoute à l'input: le nom ne doit pas être vide, avoir entre 2 et 25 caractères
// et comporter que des minuscules/majuscules.
function CheckLastName(data) {

    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
    let msg = "";
    lastNameErrorMsg.innerHTML = "";

    if (data.length == 0) {
        msg = "Merci de saisir une valeur";
        console.log(msg);
        lastNameErrorMsg.innerHTML = msg;
        return false;
    }

    if (data.length < 2 || data.length > 25) {
        msg = "Le nom doit contenir entre 2 et 25 caractères";
        console.log(msg);
        lastNameErrorMsg.innerHTML = msg;
        return false;
    }

    if (!data.match(/^[a-z A-Z]{2,25}$/)) {
        msg = "Des caractères sont incorrects";
        console.log(msg);
        lastNameErrorMsg.innerHTML = msg;
        return false;
    }

    return true;
}


// Contrôle de l'écoute à l'input: l'adresse ne doit pas être vide, avoir entre 3 et 35 caractères
// et comporter entre 1 et 3 chiffre suivi d'entre 3 et 35 minuscules/majuscules.
function CheckAddress(data) {

    let addressErrorMsg = document.getElementById("addressErrorMsg")
    let msg = "";
    addressErrorMsg.innerHTML = "";

    if (data.length == 0) {
        msg = "Merci de saisir une valeur";
        console.log(msg);
        addressErrorMsg.innerHTML = msg;
        return false;
    }

    if (data.length < 3 || data.length > 35) {
        msg = "L'adresse doit contenir entre 3 et 35 caractères";
        console.log(msg);
        addressErrorMsg.innerHTML = msg;
        return false;
    }

    if (!data.match(/^[0-9]{1,3} [a-z A-Z]{3,35}$/)) {
        msg = "Des caractères sont incorrects";
        console.log(msg);
        addressErrorMsg.innerHTML = msg;
        return false;
    }

    return true;
}


// Contrôle de l'écoute à l'input: la ville ne doit pas être vide, avoir entre 2 et 25 caractères
// et comporter entre 2 et 25 minuscules/majuscules.
function CheckCity(data) {

    let cityErrorMsg = document.getElementById("cityErrorMsg")
    let msg = "";
    cityErrorMsg.innerHTML = "";

    if (data.length == 0) {
        msg = "Merci de saisir une valeur";
        console.log(msg);
        cityErrorMsg.innerHTML = msg;
        return false;
    }

    if (data.length < 2 || data.length > 25) {
        msg = "La ville doit contenir entre 2 et 25 caractères";
        console.log(msg);
        cityErrorMsg.innerHTML = msg;
        return false;
    }

    if (!data.match(/^[a-z A-Z]{2,25}$/)) {
        msg = "Des caractères sont incorrects";
        console.log(msg);
        cityErrorMsg.innerHTML = msg;
        return false;
    }

    return true;
}


// Contrôle de l'écoute à l'input: l'email ne doit pas être vide 
// et doit comporter unMot+@+unMot+.+unMot de 2 à 4 lettres.
function CheckEmail(data) {

    let emailErrorMsg = document.getElementById("emailErrorMsg")
    let msg = "";
    emailErrorMsg.innerHTML = "";

    if (data.length == 0) {
        msg = "Merci de saisir une valeur";
        console.log(msg);
        emailErrorMsg.innerHTML = msg;
        return false;
    }
    if (!data.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        msg = "Email incorrect (ex: boby@hotmail.fr)";
        console.log(msg);
        emailErrorMsg.innerHTML = msg;
        return false;
    }
    return true;
}

