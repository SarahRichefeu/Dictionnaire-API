console.log('V1 : Mon dico anglais')

/*
MON PROGRAMME : 
> Je veux pouvoir donner la définition d'un mot à mes utilisateurs
- Récupérer le mot saisi par l'utilisateur
- Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- Récupérer le JSON qui contient la data du mot
- Afficher les infos du mot dans le HTML
- Ajouter un lecteur pour écouter la prononciation du mot
*/

/* Etape 1: Récupérer mon mot */

let wordToSearch = ""
// D'abord on récup le form
const form = document.querySelector('#form')
// Ensuite on écoute le submit
const watchSubmit = () => {
    form.addEventListener('submit', (event) => {
        // On empêche le comportement par défaut du submit (redirection)
        event.preventDefault()
        event.stopPropagation()
        // On récupère le mot saisi par l'utilisateur
        const data = new FormData(form);
        // On stocke le mot dans une variable globale
        wordToSearch =  data.get("search")
        apiCall(wordToSearch)
    })
}

/* Pour lancer le fetch au submit, soit je mets le fetch dans le submit, 
soit je mets une fonction que je déclare en dehors mais que j'appelle dans le submit */

// Etape 2 : Envoyer le mot à l'API avec fetch
const apiCall = (word) => {
    fetch( `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

        // Etape 3 : Récupérer le JSON qui contient la data du mot
        // on parse le resultat en JSON puis on récup les données
        .then((response) => response.json() )
        .then((data) => {
            // on récup le premier élément du tableau qui contient les infos du mot
            const wordData = data[0]
            // le tableau data contient des objets
            console.log(wordData.word)
        })
}

// Lancement du programme
watchSubmit()