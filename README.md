# Ticket Hub 🎟️

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT">
  <img src="https://img.shields.io/badge/React%20Native-Expo-blueviolet" alt="React Native Expo">
  </p>

**Your digital hub to never miss a show or event again! Upload your PDF tickets and keep them organized by date.**

This project is a cross-platform application (currently works on Web and Android) developed with React Native and Expo, designed to simplify how you manage your event tickets.

---

## Table of Contents (Optional)

* [✨ Features](#-features)
* [📱 Supported Platforms](#-supported-platforms)
* [📸 Screenshots](#-screenshots)
* [🛠️ Tech Stack](#️-tech-stack)
* [🚀 Getting Started](#-getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation & Running Locally](#installation--running-locally)
* [📲 APK Download](#-apk-download)
* [🤝 How to Contribute](#-how-to-contribute)
* [📜 License](#-license)
* [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Features

* **Ticket Upload:** Easily and quickly add your tickets in PDF format.
* **Event Registration:** Input event name, location, and date for each ticket.
* **Automatic Organization:** View your upcoming events sorted by date.
* **Event Details:** Access all registered information for each ticket.
* **PDF Access:**
    * **Mobile (iOS/Android):** Open the ticket PDF in your device's default reader.
    * **Web:** Download the PDF file directly to your browser.
* **Local Storage:** Your tickets and information are securely saved in your device/browser's local storage.
* **Ticket Deletion:** Remove tickets that are no longer needed.
* **Cross-Platform:** Works on iOS, Android devices, and the Web!

---

## 📱 Supported Platforms

* Android
* Web

---

## 📸 Screenshots

![lott1](https://github.com/user-attachments/assets/0fb72492-095f-406f-867e-a809dc6dea4e)
![lott2](https://github.com/user-attachments/assets/d3ca7daa-9d64-4d98-9e7e-78797c40fbe9)

---

## 🛠️ Tech Stack

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* JavaScript
* [React Navigation](https://reactnavigation.org/) (for navigation)
* [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) (for local storage)
* [expo-document-picker](https://docs.expo.dev/versions/latest/sdk/document-picker/) (for PDF selection)
* [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/) (for native file manipulation)
* [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) (for opening PDFs natively)
* [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker) (for native date selection)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (LTS version recommended)
* npm (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)
* [Expo CLI](https://docs.expo.dev/get-started/installation/):
    ```bash
    npm install -g expo-cli
    ```
* [EAS CLI](https://docs.expo.dev/build/eas-cli/) (optional for builds, but recommended):
    ```bash
    npm install -g eas-cli
    ```
* An Expo account ([expo.dev](https://expo.dev/)) for login, if you plan to use Expo services like EAS Build.

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/MatheusCally/lord-of-the-tickets.git](https://github.com/MatheusCally/lord-of-the-tickets.git)
    cd lord-of-the-tickets
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```

3.  **Run the project:**
    ```bash
    npx expo start
    ```
    This will start the Metro Bundler. From there, you can:
    * Press `w` to open the **web** version in your browser.
    * Scan the QR code with the **Expo Go** app (available on the App Store and Play Store) on your iOS or Android device.
    * Press `a` to open on an **Android** emulator (requires Android Studio and emulator setup).
    * Press `i` to open on an **iOS** simulator (requires macOS and Xcode).

---

## 📲 APK Download

For Android users who wish to install the application, `.apk` files for stable versions will be made available in the **[Releases](https://github.com/MatheusCally/lord-of-the-tickets/releases)** section of this repository.

*(Replace the link above with the correct link to your repository's Releases section after creating your first release.)*

**Note:** To install a downloaded APK, you will need to enable the "Install from unknown sources" option in your Android device's security settings.

---

## 🤝 How to Contribute

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Reporting Bugs or Suggesting Enhancements:**
    * Use the **[Issues](https://github.com/MatheusCally/lord-of-the-tickets/issues)** section to report any bugs found or to suggest new features. Please be as detailed as possible.

2.  **Contributing Code:**
    * Fork the Project.
    * Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
    * Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
    * Push to the Branch (`git push origin feature/AmazingFeature`).
    * Open a Pull Request.

---

## 📜 License

This project is distributed under the **MIT License**. See the `LICENSE` file in the root of the project for more information.

---

## 🙏 Acknowledgements (Optional)

* Thank specific libraries that were crucial.
* Thank Zaqueu Ribeiro for the ideas that inspired this project.

---
