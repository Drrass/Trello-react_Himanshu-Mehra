# Trello Clone

A Trello clone built using React, Material UI, and the official Trello API. This project implements core Trello features such as boards, lists, cards, checklists, and checkitems with a user-friendly interface and client-side routing.

## 🚀 Deployment

Access the live project at: [Trello Clone Deployment](https://trello-react-himanshu-mehra-io1y.vercel.app)

---

## 🚀 Features

### Boards
- Display all boards
- Create new boards

### Lists
- Display all lists in a board
- Create a new list
- Delete/Archive a list

### Cards
- Display all cards in a list
- Create a new card in a list
- Delete a card

### Checklists
- Display all checklists in a card
- Create a checklist in a card
- Delete a checklist

### Checkitems
- Display all checkitems in a checklist
- Create a new checkitem in a checklist
- Delete a checkitem
- Check and uncheck a checkitem

---

## 🛠️ Technologies Used

- **Frontend Framework**: React
- **UI Library**: Material UI
- **API Integration**: Axios
- **Routing**: React Router
- **Backend**: Trello REST API

---

## 📋 Prerequisites

1. Node.js installed
2. Trello account
3. Generate a Trello API key and token:
   - Get your API Key: [Trello App Key](https://trello.com/app-key)
   - Generate a Token: Follow the instructions in [Getting Started with Trello API](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)

---

## ⚙️ Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd trello-react-himanshu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure it with your Trello API key and token:
   ```env
   REACT_APP_TRELLO_API_KEY=your_api_key
   REACT_APP_TRELLO_API_TOKEN=your_api_token
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

---

## 📖 User Stories

### Boards
- **View All Boards**: Navigate to `/boards` to see all boards.
- **Single Board View**: Navigate to `/boards/<board_id>` to view all lists within a board.
- **Create Board**: Use the "Add Board" button to create a new board.

### Lists
- **Display Lists**: View all lists within a board.
- **Create List**: Add a new list to a board.
- **Delete/Archive List**: Archive or delete an existing list.

### Cards
- **Display Cards**: View all cards within a list.
- **Create Card**: Add a new card to a list.
- **Delete Card**: Remove a card from a list.

### Checklists
- **Display Checklists**: View all checklists in a card.
- **Create Checklist**: Add a new checklist to a card.
- **Delete Checklist**: Remove a checklist from a card.

### Checkitems
- **Display Checkitems**: View all checkitems in a checklist.
- **Create Checkitem**: Add a new checkitem to a checklist.
- **Delete Checkitem**: Remove a checkitem.
- **Check/Uncheck Checkitem**: Toggle the status of a checkitem.

---

## 💡 Testing

Ensure to test the application thoroughly as features are implemented:
1. Test each user story independently.
2. Verify API requests using tools like Postman or browser dev tools.
3. Check responsiveness and cross-browser compatibility.

---

## 🚀 Repository Naming

Repository name format: `trello-react-<your_name>`

---

## 🙏 Special Thanks

- **Deepak Chandola Sir**: For guidance and providing this project.

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

## 🔗 Acknowledgments

- [Trello API Documentation](https://developer.atlassian.com/cloud/trello/rest/)
- [Material UI Documentation](https://mui.com/)
- [React Documentation](https://reactjs.org/)
