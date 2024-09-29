# Daily Notification

Daily Notification is a mobile application that helps you manage and receive daily reminders.
In addition to being a notification app, it allows you to set random reminders based on preferences set in the app.

The app is built using React Native and Expo.

## Project Structure

The project structure is as follows:

### Main Folders

- **app/**: Contains the main application files, including layouts and screens.
- **assets/**: Contains resources such as fonts and images.
- **components/**: Contains reusable components
- **constants/**: Contains constants used in the app.
- **db/**: Contains functions for interacting with the SQLite database.
- **hooks/**: Contains custom hooks.
- **store/**: Contains the global state managed with Valtio.
- **types/**: Contains TypeScript type definitions.

Routing is handled with React Navigation and screens are divided into stack and tab navigators.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/salvatorelaspata/daily-notification.git
   cd daily-notification

   ```

2. Install dependencies:

   ```sh
   npm install
   ```

## Getting Started

To start developing, you can use the `npm start` command to start Expo and see the application in real-time on your device or simulator.

Then use the Expo Go app on your device to scan the QR code and view the application.

## Build and distribute

To build the app, you can use the following commands:

```sh
eas build --platform ios
eas build --platform android
```

To distribute the app, you can use the following commands:

```sh
eas submit -p ios --latest
eas submit -p android --latest
```

# To Do

[ ] Save notification device ID
[ ] Delete Specific scheduled notification and notification device
