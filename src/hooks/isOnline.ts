import { useEffect, useState } from "react"

export const useOnlineStatus = ():boolean =>{
    const [online, setOnline] = useState(()=>{
        if(navigator !== undefined && navigator.onLine)return true;
        return false;
    })
    useEffect(()=>{
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }
    })
    return online;
}