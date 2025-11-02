const firebaseConfig = {
  apiKey: "AIzaSyAlCZpBcXSN03FePXYMylIH-P8XOj09Slk",
  authDomain: "jixi-sheets-store.firebaseapp.com",
  databaseURL: "https://jixi-sheets-store-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jixi-sheets-store",
  storageBucket: "jixi-sheets-store.firebasestorage.app",
  messagingSenderId: "776051830923",
  appId: "1:776051830923:web:9ae4cb6c2f27f5b630248e"
};

if (!window.firebase || !firebase.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}
