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
            const infos = extractData(data[0])
            renderToHtml(infos)
        })
        .catch( () => {
            console.log('Le mot demandé n\'existe pas')
        })
}

// Fonction qui récupère chaque donnée que je veux et les renvoie dans un objet infos plus haut
const extractData = (data) => {
    // Le mot
    const word = data.word 
    // La phonétique (on va chercher le premier élément text)
    const phonetic = findProp(data.phonetics, "text")
    // const phonetic = data.phonetics[1].text
    // L'audio
    const audio = findProp(data.phonetics, "audio")
    // Les définitions (on récup tout)
    const meanings = data.meanings

    return {
        word: word,
        phonetic: phonetic,
        audio: audio,
        meanings: meanings
    }

    // const definition1 = data.meanings[0].definitions[0].definition
    // const partOfSpeech1 = data.meanings[0].partOfSpeech
    // const definition2 = data.meanings[1].definitions[0].definition
    // const partOfSpeech2 = data.meanings[1].partOfSpeech
}


// elle attend en argument un tableau à parcourir et une prop à chercher
const findProp = (array, prop) => {
    //Elle parcourt un tableau d'objets
    for (let i = 0; i < array.length; i++) {
        // Et cherche si l'objet contient une certaine propriété
        if (array[i].hasOwnProperty(prop)) {
            // ALors elle renvoie cette propriété (le return arrête la boucle)
            return array[i][prop]
        }
    }
}

const renderToHtml = (data) => {
    console.log(data)
}


/* il faudra afficher du coup : 
    - .card_title pour le mot 
    - .card_phonetic pour la phonétique
    - .card_bloc
    - .card_part-of-speech pour le type
    - .card_definition pour la def 
*/


// Lancement du programme
watchSubmit()