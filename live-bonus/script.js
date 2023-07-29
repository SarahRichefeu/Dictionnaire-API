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
        const wordToSearch =  data.get("search")
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
    const card = document.querySelector('.js-card')
    card.classList.remove('is-visible')

    // Pour la manipuation des textes
    // récup mon HTML
    const title = document.querySelector('.js-card-title')
    const phonetic = document.querySelector('.js-card-phonetic')
    // écrire du textContent
    title.textContent = data.word[0].toUpperCase() + data.word.slice(1)
    phonetic.textContent = data.phonetic

    // ON va créer dynamiquement les listes de définitions
    const list = document.querySelector('.js-card-list') 
    list.innerHTML = ''
    for (let i = 0; i < data.meanings.length; i++) {
        const meaning = data.meanings[i]
        const partOfSpeech = meaning.partOfSpeech
        const definition = meaning.definitions[0].definition


        // On crée les éléments HTML
        const li = document.createElement('li')
        li.classList.add('card__meaning')

        const cardPartOfSpeech = document.createElement('p')
        cardPartOfSpeech.classList.add('card__part-of-speech')
        cardPartOfSpeech.textContent = partOfSpeech

        const cardDefinition = document.createElement('p')
        cardDefinition.classList.add('card__definition')
        cardDefinition.textContent = definition

        li.appendChild(cardPartOfSpeech)
        li.appendChild(cardDefinition)
        list.appendChild(li)
    }

    // Ajout de l'audio
    const audioButton = document.querySelector('.js-card-button')
    const audioSound = new Audio(data.audio)
    console.log(audioSound)

    audioButton.addEventListener('click', () => {
        try {
            audioButton.classList.remove('card__player--off')
            audioButton.classList.add('card__player--on')
            audioSound.play()
            console.log(audioSound)
        }
        catch {
            console.log('Audio non disponible')
        }

    })
    audioSound.addEventListener('ended', () => {
        audioButton.classList.remove('card__player--on')
        audioButton.classList.add('card__player--off')

    })
}





// Lancement du programme
watchSubmit()