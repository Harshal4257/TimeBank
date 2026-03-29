const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export const cachedAPI = async (key, apiFn) => {
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
    }

    const data = await apiFn();
    cache.set(key, { data, timestamp: now });
    return data;
};

export const clearCache = (key) => {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
};