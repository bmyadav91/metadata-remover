export class AppError extends Error {
    code: string;
    isExpected: boolean;

    constructor(code: string, message: string, isExpected = true) {
        super(message);
        this.code = code;
        this.isExpected = isExpected;
    }
}