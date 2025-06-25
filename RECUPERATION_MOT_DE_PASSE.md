# Fonctionnalité de Récupération de Mot de Passe

## Vue d'ensemble

Une fonctionnalité complète de récupération de mot de passe a été ajoutée à l'application SmartLinks. Cette fonctionnalité permet aux utilisateurs de récupérer leur mot de passe en cas d'oubli.

## Fonctionnalités ajoutées

### 1. Page de Connexion mise à jour
- Ajout d'un lien "Mot de passe oublié ?" dans la page de connexion
- Le lien redirige vers la page de récupération de mot de passe

### 2. Page de Récupération de Mot de Passe (`/forgot-password`)
- Formulaire pour saisir l'adresse email
- Validation de l'email en temps réel
- Envoi d'un email de récupération
- Page de confirmation après envoi
- Possibilité de réessayer si l'email n'est pas reçu

### 3. Page de Réinitialisation de Mot de Passe (`/reset-password`)
- Accessible via un lien dans l'email de récupération
- Formulaire pour créer un nouveau mot de passe
- Validation en temps réel des critères de mot de passe
- Confirmation du nouveau mot de passe
- Gestion des tokens invalides ou expirés

## Flux d'utilisation

1. **Demande de récupération** :
   - L'utilisateur clique sur "Mot de passe oublié ?" dans la page de connexion
   - Il saisit son adresse email
   - Un email de récupération est envoyé

2. **Réinitialisation** :
   - L'utilisateur clique sur le lien dans l'email reçu
   - Il crée un nouveau mot de passe respectant les critères de sécurité
   - Il confirme le nouveau mot de passe
   - Il est redirigé vers la page de connexion

## Critères de mot de passe

Le nouveau mot de passe doit respecter les critères suivants :
- Au moins 8 caractères
- Au moins une lettre
- Au moins un chiffre

## Sécurité

- Les tokens de récupération ont une durée de vie limitée
- Les tokens sont invalidés après utilisation
- Validation côté client et serveur
- Messages d'erreur sécurisés (ne révèlent pas si l'email existe)

## Endpoints API

### POST `/api/auth/forgot-password`
- **Body** : `{ "email": "user@example.com" }`
- **Réponse** : `{ "message": "Email de récupération envoyé" }`

### POST `/api/auth/reset-password`
- **Body** : `{ "token": "reset_token", "password": "new_password" }`
- **Réponse** : `{ "message": "Mot de passe réinitialisé avec succès" }`

## Composants créés

- `ForgotPassword.tsx` : Page de demande de récupération
- `ResetPassword.tsx` : Page de réinitialisation
- Types TypeScript mis à jour dans `auth.ts`
- Fonctions ajoutées dans `AuthContext.tsx`
- Endpoints ajoutés dans `api.ts`

## Routes ajoutées

- `/forgot-password` : Page de demande de récupération
- `/reset-password` : Page de réinitialisation (avec paramètre `token`)

## Interface utilisateur

- Design cohérent avec le reste de l'application
- Utilisation des composants UI existants
- Messages d'erreur et de succès clairs
- Indicateurs de chargement
- Validation en temps réel
- Responsive design

## Gestion des erreurs

- Email invalide
- Token expiré ou invalide
- Mot de passe ne respectant pas les critères
- Erreurs de réseau
- Erreurs serveur

## Tests recommandés

1. Demander une récupération avec un email valide
2. Demander une récupération avec un email invalide
3. Utiliser un token valide pour réinitialiser le mot de passe
4. Utiliser un token expiré ou invalide
5. Tester les critères de mot de passe
6. Tester la navigation entre les pages
7. Tester la responsivité sur mobile 