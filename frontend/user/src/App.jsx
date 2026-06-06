
// const App = () => {
//   return (
//     <div>
//       APP
//     </div>
//   )
// }

// export default App
import { useState } from "react";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "./hooks/useTranslation";
import { toast } from "react-toastify";
import AuthDialog from "./components/auth/AuthDialog";

function App() {
  const { t } = useTranslation();
const [authOpen, setAuthOpen] = useState(false);
  return (
    <div>
      <LanguageSwitcher />

      <h1>{t("dashboard")}</h1>

      <p>{t("Manage your account and settings")}</p>

      <button>{t("login")}</button><br />
      <button>{t("save")}</button>
      <div className="p-10 text-3xl font-bold text-blue-700">
        Tailwind Working
      </div>
      <button 
      className="px-4 py-2 bg-green-500 text-white mx-6 rounded hover:bg-green-600"
      onClick={() => toast.success("Success!")}>test</button>

      <div className="m-20">
         <button
        onClick={() => setAuthOpen(true)}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Login / Register
      </button>

      <AuthDialog
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
      </div>
    </div>
  );
}

export default App;