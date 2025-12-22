import dotenv from "dotenv";
import { connectToDatabase} from "./config/database.js"
import app from "./config/app.js";


dotenv.config();


// Lancement
const initializeApp = async () => {
 try {
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
   });


   await connectToDatabase();
 } catch (err) {
   console.error("❌ Erreur DB :", err);
   process.exit(1);
 }
};

initializeApp();