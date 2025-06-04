export type RootStackParamList = {
    AuthLoading: undefined;
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Home: undefined;
    Ticket: undefined;
    TicketDetail: { ticket: TicketType };
  };
  
  export type TicketType = {
    _id: string;
    event: {
      name: string;
      location: string;
      date: string;
    };
    purchaserName: string;
    qrCode: string;
    isValidated: boolean;
  };
  TicketDetail: { ticket: Ticket };

  