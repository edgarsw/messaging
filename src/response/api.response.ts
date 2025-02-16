// export class ApiResponse<T> {
//     status: string;
//     data: T[];
//     message: string;
//     error: { code: number; message: string | null };
  
//     constructor(data: T[], message: string = 'Resources fetched successfully', errorCode: number = 200, 
//     errorMessage: string | null = null) {
//       this.status = errorCode === 200 || errorCode === 204 ? 'success' : 'error';
//       this.data = data;
//       this.message = message;
//       this.error = {
//         code: errorCode,
//         message: errorMessage,
//       };
//     }
//   }

  export class ApiResponse<T> {
    status: 'success' | 'fail' | 'error';
    data: T | null;
    message: string;
    error?: {
        code: number;
        message: string;
    };
  
    constructor(init?: Partial<ApiResponse<T>>) {
        Object.assign(this, init);
    }
  }