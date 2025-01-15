# Tabby: A Cross-Platform Book Scanning and Management App  

## Overview  
Tabby is a cross-platform app designed to help users manage their physical book collections effortlessly. Built with **React Native**, **Expo**, and **TypeScript** for the frontend, and **Flask** and **Python** for the backend, Tabby combines advanced scanning capabilities, intuitive organization, and smart recommendations to enhance the reading experience.  

## Key Features  
- **Book and Bookshelf Scanning:**  
  - Utilize **OCR** and **YOLO object detection** for real-time scanning of individual books (90% accuracy) and bookshelves (80% accuracy).  
  - Upload images with optimized quality to ensure fast and accurate processing.  

- **Book Management:**  
  - Organize books into custom categories, mark as read or favorited, and add personal notes.  
  - Rate books on a 1-5 star scale and add custom entries for scanned books.  

- **Search and Discovery:**  
  - Search for books online via the **Google Books API** and add them to categories.  
  - Receive personalized book recommendations based on favorites and ratings, leveraging **OpenAI API** for tag generation and **Google Books API** for fetching suggestions.  

- **Data Storage and Sync:**  
  - Use **SQLite** for efficient local storage of books, categories, and user data.  
  - Communicate seamlessly with the backend for online searches and book scanning results.  

- **User-Centric Design:**  
  - Intuitive frontend built with **Figma** designs, featuring modals and filtering for easy navigation.  
  - Optimized endpoints for smooth backend integration and fast data retrieval.  

Tabby was developed collaboratively, with significant contributions to the frontend, local storage, API integrations, and backend communication design.


`Tabby/` is for the front-end mobile application, and `server/` is for the
back-end server.

Please refer to `Tabby/README.md` for documentation on the front-end and
`server/README.md` for documentation on the backend.
