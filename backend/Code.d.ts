declare module '*.gs' {
  export const doGet: (e: any) => any;
  export const doPost: (e: any) => any;
  export const findGuestGroup: (code: any) => any;
  export const jsonResponse: (obj: any) => any;
  export const SHEET_GUESTS: string;
  export const SHEET_RESPONSES: string;
  export const SHEET_GIFT_PREFERENCES: string;
}
