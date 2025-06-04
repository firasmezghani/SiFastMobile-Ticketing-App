# SiFastMobile – Application de Billetterie

Application mobile pour la gestion des événements et des tickets, développée lors d’un stage chez SiFAST.

---

## 🚀 Fonctionnalités principales

- Authentification sécurisée (JWT) pour utilisateurs et administrateurs
- Création et gestion des événements (réservé à l’admin)
- Achat, visualisation et gestion des billets
- QR code généré pour chaque ticket (contrôle à l’entrée)
- Scan & validation des tickets (admin uniquement)
- Affichage clair du statut de validation
- Gestion des utilisateurs (admin)
- Modification du profil et du mot de passe

---

## 🛠️ Technologies utilisées

- **Frontend :** React Native (v0.71.10)
- **Backend :** Node.js, Express, MongoDB Atlas
- **Authentification :** JWT

---

## ⚙️ Installation et lancement

### 1. Cloner le projet

```bash
git clone [lien-du-repo]
```
### 2. Installer les dépendances

Frontend :

```bash
cd frontend
npm install
```

Backend :

```bash
cd backend
npm start
# ou
node server.js
```

### 3. Configurer l’environnement

Backend : renommer .env.example en .env et compléter avec votre clé MongoDB Atlas et votre secret JWT.

Frontend : vérifier l’URL du backend dans le code (API_BASE_URL).

### 4. Lancer l’application

Lancer l’API (backend) :
npm start

Lancer l’application mobile (frontend) :
npx react-native run-android

👤 Comptes de test

Admin
Email : admin@sifast.com
Mot de passe : admin123

Utilisateur
Créez un compte via l’application mobile

📝 Notes importantes

Pour scanner les QR codes, utilisez de préférence un vrai téléphone ou un émulateur compatible caméra.

L’application est conçue pour la démo, mais elle peut être personnalisée pour un usage professionnel.

Les statuts de validation des tickets sont visibles pour l’utilisateur et l’administrateur.



