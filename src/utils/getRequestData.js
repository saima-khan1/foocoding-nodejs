/**
 * This function get the body data from a HTTP request
 * 
 * @param {Request} request 
 * @returns {Promise<Object.<string, any>>}
 */
export const getRequestData = (request) => {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('error', (err) => {
      reject(err)
    }).on('data', (chunk) => {
      body += chunk
    }).on('end', () => {
      try {
        const requestData = JSON.parse(body)
        resolve(requestData)
      } catch (error) {
        reject(error)
      }
    })
  })
}

