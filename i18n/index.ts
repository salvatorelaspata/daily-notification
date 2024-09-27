import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "@/locales/en-US/translation.json";
import translationIt from "@/locales/it-IT/translation.json";
// import { Platform } from "react-native";

const resources = {
  "it-IT": { translation: translationIt },
  "en-US": { translation: translationEn },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");
  // get ipad or iphone
  // const isIpad = Platform.OS === "ios" && Platform.isPad;
  // console.log(
  //   isIpad ? "iPad: " : "iPhone: ",
  //   savedLanguage,
  //   Localization.getLocales()
  // );
  if (!savedLanguage) {
    savedLanguage = Localization.locale;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage || undefined,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
