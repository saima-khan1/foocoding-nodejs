import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getRequestData } from './getRequestData.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '../../data/users.json');
const postsFilePath = path.join(__dirname, '../../data/posts.json');

/**
 * This function sends a JSON response.
 *
 * @param {ServerResponse} response
 * @param {number} statusCode
 * @param {Object} data
 */
const sendJSONResponse = (response, statusCode, data) => {
  response.setHeader('Content-Type', 'application/json');
  response.statusCode = statusCode;
  response.write(JSON.stringify(data));
  response.end();
};

/**
 * This function saves the users data to the users.json file.
 *
 * @param {Array} users
 */
const saveUsers = (users) => {
  writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

/**
 * This function saves the posts data to the posts.json file.
 *
 * @param {Array} posts
 */
const savePosts = (posts) => {
  writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
};

/**
 * This function handles the HTTP request.
 *
 * @param {import('http').IncomingMessage} request
 * @param {import('http').ServerResponse} response
 */
export const requestHandler = async (request, response) => {
  const { headers, method, url } = request;
  const { address, port } = request.socket.server.address();
  const fullEndpoint = `http://${address}:${port}${url}`;

  console.log(url);
  const path = url.split('/')[1];

  switch (path) {
    case 'users': {
      const usersPattern = new URLPattern({ pathname: '/users/:id' });
      const usersEndpoint = usersPattern.exec(fullEndpoint);
      const id = usersEndpoint?.pathname?.groups?.id;
      const users = JSON.parse(readFileSync(usersFilePath, 'utf8'));
      switch (method) {
        case 'POST': {
          const body = await getRequestData(request);
          const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
          const newUser = { id: maxId + 1, ...body };
          users.push(newUser);
          saveUsers(users);
          sendJSONResponse(response, StatusCodes.CREATED, newUser);
          break;
        }        

        case 'GET': {
          if (id) {
            const user = users.find(user => user.id === parseInt(id));
            if (user) {
              sendJSONResponse(response, StatusCodes.OK, user);
            } else {
              sendJSONResponse(response, StatusCodes.NOT_FOUND, { error: ReasonPhrases.NOT_FOUND });
            }
          } else {
            sendJSONResponse(response, StatusCodes.OK, users);
          }
          break;
        }

        case 'PATCH': {
          if (id) {
            const userIndex = users.findIndex(user => user.id === parseInt(id));
            if (userIndex !== -1) {
              const body = await getRequestData(request);
              const updatedUser = { ...users[userIndex], ...body };
              users[userIndex] = updatedUser;
              saveUsers(users);
              sendJSONResponse(response, StatusCodes.OK, updatedUser);
            } else {
              sendJSONResponse(response, StatusCodes.NOT_FOUND, { error: ReasonPhrases.NOT_FOUND });
            }
          } else {
            sendJSONResponse(response, StatusCodes.BAD_REQUEST, { error: ReasonPhrases.BAD_REQUEST });
          }
          break;
        }

        case 'DELETE': {
          if (id) {
            const userIndex = users.findIndex(user => user.id === parseInt(id));
            if (userIndex !== -1) {
              const deletedUser = users[userIndex];
              users.splice(userIndex, 1);
              saveUsers(users);
              sendJSONResponse(response, StatusCodes.OK, deletedUser);
            } else {
              sendJSONResponse(response, StatusCodes.NOT_FOUND, { error: ReasonPhrases.NOT_FOUND });
            }
          } else {
            sendJSONResponse(response, StatusCodes.BAD_REQUEST, { error: ReasonPhrases.BAD_REQUEST });
          }
          break;
        }

        default:
          sendJSONResponse(response, StatusCodes.BAD_REQUEST, { error: ReasonPhrases.BAD_REQUEST });
          break;
      }

      break;
    }

    case 'posts': {
      const postsPattern = new URLPattern({ pathname: '/posts/:id' });
      const postsEndpoint = postsPattern.exec(fullEndpoint);
      const id = postsEndpoint?.pathname?.groups?.id;
      const posts = JSON.parse(readFileSync(postsFilePath, 'utf8'));
      switch (method) {
        case 'POST': {
          const body = await getRequestData(request);
          const maxId = posts.reduce((max, post) => (post.post_id > max ? post.post_id : max), 0);
          const newPost = { post_id: maxId + 1, ...body };
          posts.push(newPost);
          savePosts(posts);
          sendJSONResponse(response, StatusCodes.CREATED, newPost);
          break;
        }

        case 'GET': {
          if (id) {
            const post = posts.find(post=> post.post_id === parseInt(id));
            if (post) {
              sendJSONResponse(response, StatusCodes.OK, post);
            } else {
              sendJSONResponse(response, StatusCodes.NOT_FOUND, { error: ReasonPhrases.NOT_FOUND });
            }
          } else {
            sendJSONResponse(response, StatusCodes.OK, posts);
          }
          break;
        }

        case 'PATCH': {
          if (id) {
            const postIndex = posts.findIndex(post => post.post_id === parseInt(id));
            if (postIndex !== -1) {
              const body = await getRequestData(request);
              const updatedPost = { ...posts[postIndex], ...body };
              posts[postIndex] = updatedPost;
              savePosts(posts);
              sendJSONResponse(response, StatusCodes.OK, updatedPost);
            } else {
              sendJSONResponse(response, StatusCodes.NOT_FOUND, { error: ReasonPhrases.NOT_FOUND });
            }
          } else {
            sendJSONResponse(response, StatusCodes.BAD_REQUEST, { error: ReasonPhrases.BAD_REQUEST });
          }
          break;
        }

        case 'DELETE': {
          if (id) {
            const postIndex = posts.findIndex(post => post.post_id === parseInt(id));
            if (postIndex !== -1) {
              const deletedPost = posts[postIndex];
              posts.splice(postIndex, 1);
              savePosts(posts);
              sendJSONResponse(response, StatusCodes.OK, deletedPost);
            } else {
              sendJSONResponse(response, StatusCodes.NOT_FOUND, { error: ReasonPhrases.NOT_FOUND });
            }
          } else {
            sendJSONResponse(response, StatusCodes.BAD_REQUEST, { error: ReasonPhrases.BAD_REQUEST });
          }
          break;
        }

        default:
          sendJSONResponse(response, StatusCodes.BAD_REQUEST, { error: ReasonPhrases.BAD_REQUEST });
          break;
      }

      break;
    }
  }
};
