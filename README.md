<!-- Relasi model :
Category & Product -> 1 to Many (1 Category Many Product)
Order & Product    -> 1 to Many (1 Product Many Order)
Order & User       -> 1 to 1 (1 Order 1 User) -->

# Project Akhir Typescript App

API untuk menyediakan fungsionalitas untuk melakukan CRUD : 
- Category
- Product
- Order (Create saja)

## Libraries Used

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js
- [path](https://nodejs.org/api/path.html): Node.js path module for working with file and directory paths
- [ejs](https://www.npmjs.com/package/ejs): Embedded JavaScript templating
- [body-parser](https://www.npmjs.com/package/body-parser): Node.js body parsing middleware

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>

  | Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/api/posts`                             | Retrieve all posts.                      |
| `POST`   | `/api/posts`                             | Create a new post.                       |
| `GET`    | `/api/posts/28`                          | Retrieve post #28.                       |
| `PATCH`  | `/api/posts/28`                          | Update data in post #28.                 |
| `POST`   | `/api/posts/28/comments`                 | Add comment to post #28.                 |
| `GET`    | `/api/posts/28/comments?status=approved&limit=10&page=4` | Retrieve page 4 of the comments for post #28 which are approved, with 10 comments per page. |
| `DELETE` | `/api/posts/28/comments/1987` or `/api/comments/1987` | Delete comment #1987.                    |
| `GET`    | `/api/users?active=true&sort=username&direction=asc&search=nodes` | Search for "nodes" in active users, sorted  by username ascendingly. | 
