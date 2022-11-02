//////////////////////      FETCH    ///////////////////

// On fait une requète à l'API sur les infos que contiennent tous les produits. 
const fetchKanap = async (url) => {
    
    await fetch(url)
        .then((Response) => Response.json())
        .then((Promise) => {
            showKanaps(Promise);
        })
        .catch((e) => {
            document.getElementById("items").innerHTML = "Merci de revenir plus tard";
            console.log("fetchKanap : erreur au niveau du back");
        });
}


// Fonction boucle sur kanaps afin de séparer chaque kanap(info individuel) des kanaps.
function showKanaps(kanaps) {

    //contrôle de la variable kanaps si elle est vide
    if (kanaps == null) {
        console.log('showkanaps : la variable kanaps est vide');
        return;
    }

    //action boucle sur kanaps et appel de la fonction showkanap(inject JS des produits)
    for (let kanap of kanaps) {
        showKanap(kanap);
    }   
}


//fonction injection JS des cards produits.
function showKanap(kanap) {

    // déclaration
    let a = document.createElement("a");
    let article = document.createElement("article");
    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");

    //initiation structure d'injection
    document.getElementById("items").appendChild(a);
    a.appendChild(article);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);

    //contrôle
    if (kanap == null) {
        //message à l'utilisateur ou à la console
        console.log('showkanap : la variable kanap est vide');
        return;
    }

    //action
    a.setAttribute("href", "./product.html?id="+ kanap._id);
    a.setAttribute("title", kanap.name);
    img.setAttribute("src", kanap.imageUrl);
    img.setAttribute("alt", kanap.altTxt);
    h3.innerHTML = kanap.name;
    h3.classList.add("productName");
    p.innerHTML = kanap.description;
    p.classList.add("productDescription");
}


//////////////////      POINT D'ENTREE      ///////////////////

function main() {
    // Appel de fetchKanap: affichage des produits de l'API
    let url = "http://localhost:3000/api/products";
    fetchKanap(url);
}

main();
