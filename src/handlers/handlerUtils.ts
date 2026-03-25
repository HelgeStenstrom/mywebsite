export function errorResponse(res, status: number, message: string) {
    return res.status(status).json({ status, message });
}