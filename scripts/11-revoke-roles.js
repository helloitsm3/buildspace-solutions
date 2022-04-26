import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x29504A69a2A81F9030186de7F2F41Ef4cade1f4a");

(async () => {
    try {
        // Log the current roles.
        const allRoles = await token.roles.getAll();

        console.log("👀 Roles that exist right now:", allRoles);

        // Revoke all the superpowers your wallet had over the ERC-20 contract.
        await token.roles.setAll({ admin: [], minter: [] });
        console.log("🎉 Roles after revoking ourselves", await token.roles.getAll());
        console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");
    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO trasury", error);
    }
})();
