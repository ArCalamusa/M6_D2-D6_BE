# M6_D2-D6_BE
Ho creato un server su una porta locale; creato le rotte e i modelli per post e utenti, criptando i dati sensibili (attraverso la libreria bcrypt) ed inserendoli in un file .env, inoltre ho inserito un token che autorizzerà l'accesso all'utente per un tempo definito (dopodiché sarà necessario rinnovarlo).

I dati dei post e degli utenti verranno inseriti in una collelection di MongoDB ove il dato relativo alla psw arriverà già criptato.

![Schermata 2023-06-02 alle 14 23 07](https://github.com/ArCalamusa/M6_D2-D6_BE/assets/117526559/8922e03b-fc80-49f7-999b-9e05216383fc)

Le immagini dei nuovi post creati verranno inseriti nella cartella predefinita /uploads

L’utilizzo di un middleware garantisce che solo l’utente autorizzato può eccedere inoltre definendo in principio user e psw obbligatori non è possibile accedere senza valorizzare entrambi i campi (il campo email ha un ulteriore controllo sul formato che deve rispecchiare il requisito esempio@esempio.es)
