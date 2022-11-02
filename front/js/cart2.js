let addProduit = JSON.parse(localStorage.getItem("produit"));

console.log(addProduit)
/*
const fetchAddProduit = async (addProduit) => {

    if (addProduit == null ||addProduit == "") {
        //message d'erreur
        showMessageForUser("Merci de revenir plus tard", "fetchKanap", "erreur au niveau du back");
        return;
    }

    await fetch(addProduit)
        .then((Response) => Response.json.parse())
        .then((Promise) => {
            showCart(Promise);
            console.log(Promise)

        })

        .catch((e) => {
            showMessageForUser("Merci de revenir plus tard", "fetchKanap", "erreur au niveau du back");
        })
};

fetchAddProduit();
*/

function  showCart(addProduit) {
    
    console.log("!!! continue t'assure !!!");
    
    if (addProduit) {   
        console.log(addProduit);
    }
    
    // déclaration
    let article = document.createElement("article");
    let div = document.createElement("div");
    let img = document.createElement("img");
    let h2 = document.createElement("h2");
    let p = document.createElement("p");
    let input = document.createElement("input");

    //initiation
/*
    cart__items.innerHTML = addProduit.map(
        (produit) => `
        <article class="cart__item" data-id="${produit.id}" data-color="${produit-color}">
                <div class="cart__item__img">
                  <img src="${produit.imageURL}" alt="${produit.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${produit.name}</h2>
                    <p>${produit.color}</p>
                    <p>${produit.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : ${produit.quantity} </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
        `
    );

    totalQuantity.innerHTML = produit.quantity;
    totalPrice.innerHTML = produit.quantity * produit.price.toString();
    /*
    article.appendChild(div);
    div.appendChild(img);

    if (cart == null) {
        console.log('showCart : la variable cart est vide');
        //message à l'utilisateur ou à la console
        return;
    }
    */
    //action

    article.classList.add("cart__item");
    div.classList.add("cart__item__img");
    //article.setAttribute("data-id", cart.id);
    //article.setAttribute("data-color", cart.color);
    //img.setAttribute("src", cart.imageUrl);
    //img.setAttribute("alt", cart.altTxt );
    //h2.innerHTML = cart.name


    console.log(article)
    //return
};

showCart();


function showMessageForUser(messageUser, fonction, messageDev) {
    document.getElementById("cart__items").innerHTML = messageUser;
    console.log(fonction + " : " + messageDev);
};

//////////// CONFIRMATION PANIER/////////////////////

let commandProducts = JSON.parse(localStorage.getItem("commandes"));

order.addEventListener("submit", (e) => {
    e.preventDefault();
    if (valueFirstName && valueLastName && valueAddress && valueCity && valueEmail) {
        let commandConfirmation = JSON.parse(localStorage.getItem("produit"));
        let commandeId = [];
        console.log(commandConfirmation);
        console.log(commandeId);

        commandConfirmation.forEach((commande) => {
            commandeId.push(commande.id)
        })

        let dataCommande = {
            contact: {
                firstName: valueFirstName,
                lastName: valueLastName,
                address: valueAddress,
                city: valueCity,
                email: valueEmail,
            },
            products: commandeId,
        }
        console.log(dataCommande)

        /////////////////FETCH POST///////////////////////////

        let responseServeur = [];

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataCommande),
        })
            .then((res) => res.json())
            .then((promise) => {
                responseServeur = promise;
                console.log(responseServeur);

                let dataCommande = {
                    contact: responseServeur.contact,
                    order: responseServeur.orderId,
                    Total: sommeProducts,
                };

                if (commandProducts == null) {
                    commandProducts = [];
                    commandProducts.push(dataCommande)
                    localStorage.setItem("commandes", JSON.stringify(commandProducts))
                } else if (commandProducts != null) {
                    commandProducts.push(dataCommande);
                    localStorage.setItem("commandes", JSON.stringify(commandProducts))
                }
                localStorage.removeItem("produit");
                location.href = "confirmation.html";
            });

        firstName.value = "";
        lastName.value = "";
        address.value = "";
        city.value = "";
        email.value = "";
        valueFirstName = null;
        valueLastName = null;
        valueAddress = null;
        valueCity = null;
        valueEmail = null;
    } else {
        alert("remplir le formulaire correctement");
    }

});
console.log(commandProducts);