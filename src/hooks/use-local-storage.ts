import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    // https://stackoverflow.com/questions/72585007/react-usestate0-vs-usestate-0
    const [storeValue, setStoreValue] = useState<T>(() => {
        // Does not matter whether I use a value or a function for useState for a simple case
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue; // 重點是回傳的值，可以作為state使用
        } catch (error) {
            console.log(error)
            return initialValue;
        }
    })


    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storeValue))
        } catch (error) {
            console.error(error);
        }
    }, [key, storeValue])

    return [storeValue, setStoreValue ] as const // 但調用的時候，這裡的內容可以rename，只是要注意順序
}