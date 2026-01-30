require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});

const connectDB = require("../config/db");
const Produit = require("../models/Produit");

(async () => {
  try {
    await connectDB();

    const result = await Produit.updateMany(
      {},
      {
        $set: {
          statutValidation: "accepte",
          raisonRefus: null,
          dateValidation: new Date(),
        },
      },
    );

    console.log(
      `✅ Produits mis à jour: ${result.modifiedCount || result.nModified}`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    process.exit(1);
  }
})();
