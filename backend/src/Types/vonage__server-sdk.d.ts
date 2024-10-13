
declare module '@vonage/server-sdk' {
    interface AuthInterface {
      getQueryParams?: () => any;
      createSignatureHash?: () => any;
      createBasicHeader?: () => any;
      createBearerHeader?: () => any;
    }
  
    export class Vonage {
      constructor(options: {
        apiKey: string;
        apiSecret: string;
        // Add other properties if required
      });
      message: {
        sendSms(from: string, to: string, text: string, callback: (error: any, response: any) => void): void;
        // Add other methods if needed
      };
      sms: {
        send(options: SmsOptions): Promise<SmsResponse>;
      }; sms: {
        send(options: SmsOptions): Promise<SmsResponse>;
      };
      // Define methods and properties based on the SDK documentation
    }
  }