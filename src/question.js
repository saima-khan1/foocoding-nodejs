import { createInterface } from 'readline'
import { stdin , stdout } from 'process'
export const question = async (query) => {
    const readline = createInterface({
      input: stdin,
      output: stdout,
    });
    const answer = await new Promise((resolve) => {
      readline.question(query, (input) => {
        resolve(input);
      });
    });
    readline.close();
    return answer.toLowerCase();
  };