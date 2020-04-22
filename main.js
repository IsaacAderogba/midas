require("dotenv").config();
const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";
autoUpdater.autoDownload = false;

const updater = () => {
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", () => {
    dialog.showMessageBox(
      {
        type: "info",
        title: "Update available",
        message:
          "A new version of Midas is available. Do you want to update now?",
        buttons: ["Update", "Later"],
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
        }
      }
    );
  });

  autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox(
      {
        type: "info",
        title: "Update ready",
        message: "Install and restart now?",
        buttons: ["Yes", "Later"],
      },
      (buttonIndex) => {
        if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
      }
    );
  });
};

let mainWindow;

function createWindow() {
  updater();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true },
  });

  mainWindow.loadURL(process.env.DOMAIN || "https://getmidas.herokuapp.com");

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
