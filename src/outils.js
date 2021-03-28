export const getIdConversation = (id1, id2) => {
    const arrId1 = id1.split('')
    const arrId2 = id2.split('')

    const letters = arrId1.map(x => { if(Number.isNaN(parseInt(x))) return x } ).filter(x => x !== undefined).concat(arrId2.map(x => { if(Number.isNaN(parseInt(x))) return x } ).filter(x => x !== undefined))

    const numbers = arrId1.map(x => { if(!Number.isNaN(parseInt(x))) return x } ).filter(x => x !== undefined).concat(arrId2.map(x => { if(!Number.isNaN(parseInt(x))) return x } ).filter(x => x !== undefined))

    return numbers.sort().concat(letters.sort()).join('')
}

export const scaleTheArray = (arr) => {
    var obj = {info: {}, contacts:[]}
    for(let i = 0; i < arr?.length; i++){
        if('id' in arr[i]) obj['info'] = arr[i]
        else obj?.contacts?.push(arr[i])
    }
    return obj
}

export const FirstLetterMaji = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export const TheRightSize = (str) => {
    if(str.length > 20) return str.slice(0, 25) + "..."
    else return str
}

// console.log(getIdConversation("lDgzfgLU6ANIbwOf3MinJW7vqqo2", "hpaAMTC9kbP0G4UhnMabrPpS8tB3"))

