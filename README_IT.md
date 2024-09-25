# Daily Notification

Daily Notification è un'applicazione mobile che ti aiuta a gestire e ricevere promemoria giornalieri. L'app è costruita utilizzando React Native ed Expo.

## Struttura del Progetto

La struttura del progetto è la seguente:

### Cartelle Principali

- **app/**: Contiene i file principali dell'applicazione, inclusi layout e schermate.
- **assets/**: Contiene risorse come font e immagini.
- **components/**: Contiene componenti riutilizzabili
- **constants/**: Contiene costanti utilizzate nell'app.
- **db/**: Contiene funzioni per l'interazione con il database SQLite.
- **hooks/**: Contiene hook personalizzati.
- **scripts/**: Contiene script di utilità come [`reset-project.js`]
- **store/**: Contiene lo stato globale gestito con Valtio.
- **types/**: Contiene definizioni di tipi TypeScript.

Il routing è gestito con React Navigation e le schermate sono divise in stack e tab navigator.

## Installazione

1. Clona il repository:

   ```sh
   git clone https://github.com/salvatorelaspata/daily-notification.git
   cd daily-notification
   ```

2. Installa le dipendenze:

   ```sh
   npm install
   ```

3. Avvia l'applicazione:
   ```sh
   npm start
   ```

## Getting Started

Per iniziare a sviluppare, puoi utilizzare il comando `npm start` per avviare Expo e vedere l'applicazione in tempo reale sul tuo dispositivo o simulatore.

Utilizzare quindi l'app Expo Go sul proprio dispositivo per scansionare il codice QR e visualizzare l'applicazione.
