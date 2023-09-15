const Storage = {
    token: "token",
    userId: "user_id",
    roleId: "role_id",
    demoEmail: "demo_email",
    demoPhone: "demo_phone",
};

export class StorageManager {
    static get<K extends keyof typeof Storage>(key: K) {
        if (global.localStorage) {
            return localStorage.getItem(Storage[key]);
        }
    }

    static set<K extends keyof typeof Storage>(key: K, value: string) {
        if (global.localStorage) {
            localStorage.setItem(Storage[key], value);
        }
    }

    static clear() {
        if (global.localStorage) {
            localStorage.clear();
        }
    }
}
