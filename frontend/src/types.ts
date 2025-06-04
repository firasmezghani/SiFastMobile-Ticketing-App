// src/types.ts


export type Ticket = {
  _id: string;
  purchaserName: string;
  isValidated: boolean;
  qrCode: string; // ✅ This is the missing field
  event: {
    name: string;
    date: string;
    location: string;
  };
};


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  ScanTicket: undefined;
  CreateTicket: undefined;
  TicketScreen: undefined;
  TicketDetail: { ticket: Ticket }; // ✅ this is key
  CreateEvent: undefined;
  EventList: undefined;
};
