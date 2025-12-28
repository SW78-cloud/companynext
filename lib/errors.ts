export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(401, message, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(403, message, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Not found') {
        super(404, message, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(429, message, 'RATE_LIMIT_EXCEEDED');
        this.name = 'RateLimitError';
    }
}

export function formatErrorResponse(error: unknown) {
    if (error instanceof AppError) {
        return {
            error: {
                message: error.message,
                code: error.code,
                statusCode: error.statusCode,
            },
        };
    }

    console.error('Unexpected error:', error);

    return {
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
            statusCode: 500,
        },
    };
}
