# SOEN 341 project: Versatile communication platform
####  Project and sprint repository
---
## Collaborator Information (name, id, GitHub username)


* Aren Kaspar
40283361
GitHub username: AK-23-23

* Layla Beylouneh
40264291
GitHub username: Laylabey02

* Mohammed Allahham
40107585
Github username: aero5pace

* Mathieu Jazrawi
40284648
Github username: Mathieujaz

* Mohamed Ali Bahi 
40282763
Github username: A1iBA

* Wassim Dakka
40276235
Github username: wassdak

* Rim Charafeddine
40282994
Github username : rimmch
---

## Description and core features

The purpose of this project is to create a communication platform designed for interaction through text channels and direct messaging. Users will be able to create an account to communicate with another user or join channels to message multiple users at a time. Admin accounts can also be created to manage channels, messages, and users.


### High-level user stories for the 3 core features:

* STORY 1:
  
   Users can join predefined text channels, such as sports, movies, and new technologies, to communicate with other users on relevant topics. Messages sent within a channel are visible to all members of that channel.

* STORY 2:
  
   Users can send and receive messages from other users to have one-on-one conversations in a private chat

* STORY 3:
  
   Admins can create and delete channels, as well as moderate messages by deleting inappropriate ones. Members can send and view messages in channels and private messages but do not have the admins' privileges.

---

## Languages and Technologies

* HTML, CSS, Javascript
* React.js
* Firebase & Node.js
* Figma

## Coding Style and Conventions

This project follows several conventions to maintain code quality, consistency, and readability:

* **Functional Components:** React components are primarily written as **functional components**, leveraging the modern Hooks API instead of class-based components.
* **React Hooks:** Standard React Hooks (`useState`, `useEffect`, `useRef`, etc.) are used for managing state, side effects, and refs within components.
* **Modular CSS:** Styling is organized using **separate `.css` files for each component** (e.g., `Dashboard.css`, `Chat.css`). This promotes style encapsulation and maintainability.
* **`className` for Styling:** Styles defined in the CSS files are applied to JSX elements using the standard `className` attribute.
* **Descriptive Naming:** Efforts are made to use descriptive names for components (PascalCase, e.g., `LoginRegisterPage`) and CSS classes (e.g., `fade-in`, `user-list`) to enhance code clarity.
* **Separation of Concerns:** The codebase aims to separate concerns by keeping:
    * UI rendering logic within the component files.
    * Styling rules within dedicated CSS files.
    * Business logic (like API interactions or complex state logic) potentially separated or managed cleanly within components/hooks.
* **Modern JavaScript:** The project utilizes features from modern JavaScript (ES6 and newer) where appropriate.

