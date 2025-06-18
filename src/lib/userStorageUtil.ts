export const getOrCreateUserId = (): string => {
    const USER_ID_KEY = 'collaborative-user-id';
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
};