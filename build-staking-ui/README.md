This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🎨 Create the BLD token & minting UI

Time to get back to shipping our custom NFT staking app we've developed in Core 1. We'll use our learnings with the token program and the candy machine to build out our app.

### Install dependencies

```bash
npm install
```

### Run the app

- Create BLD token using - ```npm run create-bld-token```
- Create candy machine by placing the NFTs in assets folders and run  - ```sugar launch```
- Create the minting UI by running - ```npm run dev```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<i><i style="color:red">*</i> Remember to replace the candy machine address in <b>Connected.tsx</b> file with yours. </i>
