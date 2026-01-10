import { env } from "./config/env.js";
import { connectToDatabase} from "./config/database.js"
import app from "./config/app.js";


// Lancement
const initializeApp = async () => {
 try {
   const PORT = env.PORT;
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