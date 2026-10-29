// createdAt and updatedAt are set separately on insert and differ by a few milliseconds.
export const isMessageEdited = (message: { createdAt: string; updatedAt: string }) =>
    Math.abs(new Date(message.updatedAt).getTime() - new Date(message.createdAt).getTime()) >= 1000;
