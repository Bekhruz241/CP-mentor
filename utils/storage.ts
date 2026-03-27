
import { AppState } from "../types";
import { INITIAL_PROFILE } from "../constants";

const STORAGE_KEY = "ai_cp_mentor_state_v1";

export const saveState = (state: AppState) => {
  if (!state) return;
  try {
    // Faqat oxirgi 50 ta xabarni saqlaymiz (xotira to'lmasligi uchun)
    // Chunki context uchun baribir 15 tasi yetarli
    const stateToSave = {
      ...state,
      messages: state.messages.slice(-50) 
    };
    const serialized = JSON.stringify(stateToSave);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error("Ma'lumotlarni saqlashda xatolik (LocalStorage to'lgan bo'lishi mumkin):", e);
  }
};

export const loadState = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Malumotlar butunligini tekshirish
      if (!parsed || typeof parsed !== 'object') throw new Error("Invalid data format");
      
      return {
        profile: parsed.profile || INITIAL_PROFILE,
        dailySets: parsed.dailySets || {},
        messages: parsed.messages || [],
        restDays: parsed.restDays || []
      };
    }
  } catch (e) {
    console.error("Ma'lumotlarni yuklashda xatolik:", e);
  }
  
  return {
    profile: INITIAL_PROFILE,
    dailySets: {},
    messages: [],
    restDays: []
  };
};
