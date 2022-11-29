## 🎬 Movie Review Program

In this section, we will be building a simple movie review program that stores data of  a movie review in PDA account. We'll also implementing security to it to avoid any unauthorized access to the data. We will be using the [Solana Playground](https://beta.solpg.io) to develop and deploy our program.

<b>Link to the code on Solpg</b>: https://beta.solpg.io/638457b677ea7f12846aef4d

### 📝 Instructions
1. Create a new project in Solana Playground
2. Copy the files in `src` folder to `program/src` folder.
3. Click on the Build & Depoloy Menu on the top right corner of the screen and click  `Build` button to build the program.
4. Click on the `Deploy` button to deploy the program.
5. Now, you will get a `Program ID` that can be used to interact with the program.(Can be found in Program and deploy Menu - Program Credentials)

### Testing the program
1. Install the dependencies by running `npm install` in the `client` folder.
2. Replace the `movieProgramId` in `index.ts` with the `Program ID` you got in the previous step.
3. Now run `npm run start` in the `client` folder.
4. You will get a url of solana explorer. where you can see the transactions and the the movie review you've submitted .