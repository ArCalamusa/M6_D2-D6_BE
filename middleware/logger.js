const logger = (req, res, next) => { //funzione che accetta 3 paramentri
    const { url, ip, method } = req

    console.log(`${new Date().toISOString()} Effettuata richiesta ${method} all'endpoint ${url} da indirizzo ${ip}`)

    next() //procedi con la richiesta
}

export default logger