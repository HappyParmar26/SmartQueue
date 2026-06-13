import { useTranslation } from "../hooks/useTranslation";

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="gu">ગુજરાતી</option>
    </select>
  );
}