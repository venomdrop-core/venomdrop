import * as fs from 'fs';


/**
 * Replaces a specific KEY=VALUE pair in a .env file.
 * @param envFilePath - The path to the .env file.
 * @param key - The key to replace.
 * @param value - The new value to set for the key.
 */
export const replaceEnvKeyValue = (envFilePath: string, key: string, value: string) => {
  // Read the contents of the .env file
  const envContent: string = fs.readFileSync(envFilePath, 'utf8');

  // Create a regular expression pattern to match the specific KEY=VALUE pair
  const regex: RegExp = new RegExp(`${key}=.*`);

  // Replace the matching KEY=VALUE pair with the new value
  const updatedContent: string = envContent.replace(regex, `${key}=${value}`);

  // Write the updated content back to the .env file
  fs.writeFileSync(envFilePath, updatedContent);

  console.log(`Successfully replaced ${key}=${value} in ${envFilePath}.`);
};
