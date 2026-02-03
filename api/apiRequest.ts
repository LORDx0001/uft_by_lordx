import axios from "axios";
import i18n from "../src/i18n/i18n";

export const apiRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  params?: any
): Promise<T> => {
  const lang = i18n.language || navigator.language.split("-")[0] || "en";
  i18n.changeLanguage(lang);
  const BASE_URL = `https://api.uft.uz/${lang}/api/v1`;

  const response = await axios({
    method,
    url: `${BASE_URL}${url}`,
    data,
    params,
  });

  return response.data;
};
