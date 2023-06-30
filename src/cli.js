import fetch from 'node-fetch';
import { question } from './question.js';
import { parseArgs } from 'util';
// Rest of the code remains unchanged


const BASE_URL = 'http://127.0.0.1:3000'

/**
 * Ask a asynchronous question to the user and get the answer from stdin
 *
 * @param {string} query
 * @returns {Promise.<string>}
 */

const options = {
    'resource': { type: 'string' },
    'method': { type: 'string' },
    'id': { type: 'string' },
    'all': { type: 'boolean' },
  };
  const { values } = parseArgs({ options });
  console.log('test values',values );


export const getResource = async () => {
    const resource = values.resource || (await question('Enter the desired resource (users or posts): ')).toLowerCase();
    const method = values.method?.toLowerCase() || (await question('Enter the HTTP method (GET, POST, PATCH, DELETE): ')).toLowerCase();

        let url = `${BASE_URL}/${resource}`;
        if (method === 'get') {
            if (values.id) {
              url += `/${values.id}`;
            } else if (values.all) {
                      url;
                    }
            else {
              const option = await question('Enter the option to get data by (all or ID): ');
              if (option.toLowerCase() === 'id') {
                const id = await question('Enter the ID: ');
                url += `/${id}`;
              }
            }
          } else if (method === 'patch' || method === 'delete') {
            if (values.id) {
                url += `/${values.id}`;
              } else {
                const id = await question('Enter the ID: ');
            url += `/${id}`;
              }
          }
        const requestOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
        };

        if (method === 'post') {
          const body = {};

          if (resource === 'users') {
            body.first_name = await question('Enter the first name: ');
            body.last_name = await question('Enter the last name: ');
            body.email = await question('Enter the email: ');
            body.gender = await question('Enter the gender: ');
          } else if (resource === 'posts') {
            body.user_id = await question('Enter the user_id: ');
            body.post_text = await question('Enter the post_text: ');
            body.post_date = await question('Enter the post_date: ');
            body.likes = await question('Enter the likes: ');
            body.comments = await question('Enter the comments: ');
            body.hastags = await question('Enter the hastags: ');
            body.location = await question('Enter the location: ');
            body.post_image = await question('Enter the post_image: ');
          }

          requestOptions.body = JSON.stringify(body);
        }

        if (method === 'patch') {
          const updatedFields = {};

          if (resource === 'users') {
            const firstName = await question('Enter the first name: ');
            const lastName = await question('Enter the last name: ');
            const email = await question('Enter the updated email: ');
            const gender = await question('Enter the gender: ');

            updatedFields.first_name = firstName.trim() !== '' ? firstName : undefined;
            updatedFields.last_name = lastName.trim() !== '' ? lastName : undefined;
            updatedFields.email = email.trim() !== '' ? email : undefined;
            updatedFields.gender = gender.trim() !== '' ? gender : undefined;
          } else if (resource === 'posts') {
            const userId = await question('Enter the user_id: ');
            const postText = await question('Enter the post_text: ');
            const postDate = await question('Enter the post_date: ');
            const likes = await question('Enter the likes: ');
            const comments = await question('Enter the comments: ');
            const hastags = await question('Enter the hastags: ');
            const location = await question('Enter the location: ');
            const postImage = await question('Enter the post_image: ');

            updatedFields.user_id = userId.trim() !== '' ? userId : undefined;
            updatedFields.post_text = postText.trim() !== '' ? postText: undefined;
            updatedFields.post_date = postDate.trim() !== '' ? postDate: undefined;
            updatedFields.likes = likes.trim() !== '' ? likes: undefined;
            updatedFields.comments = comments.trim() !== '' ? comments: undefined;
            updatedFields.hastags = hastags.trim() !== '' ? hastags: undefined;
            updatedFields.location = location.trim() !== '' ? location: undefined;
            updatedFields.postImage = postImage.trim() !== '' ? postImage: undefined;
          }

          requestOptions.body = JSON.stringify(updatedFields);
        }

        try {
          const response = await fetch(url, requestOptions);
          let successMessage = '';
          if (response.ok) {
            if (method === 'post') {
              successMessage = `${resource.slice(0, -1).toUpperCase()} added successfully`;
            } else if (method === 'patch') {
              successMessage = `${resource.slice(0, -1).toUpperCase()} ${url.split('/').pop()} updated successfully`;
            } else if (method === 'delete') {
              successMessage = `${resource.slice(0, -1).toUpperCase()} ${url.split('/').pop()} deleted successfully`;
            }
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Response:', data);
          console.log(successMessage);
        } catch (error) {
          console.error('Error:', error.message);
        }
  };
  getResource();
