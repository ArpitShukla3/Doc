import { Spinner } from "@components/ui/spinner";
import { paths } from "@config/paths";
import { QueryClient,useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const convert = (QueryClient: QueryClient) => {
    return (m: any)=>{
        const { clientLoader, clientAction, default: Component, ...rest } = m;
        return {
            ...rest,
            loader: clientLoader?.(QueryClient),
            action : clientAction?.(QueryClient),
            Component,
            };
    };
};
export const createAppRouter = (queryClient: QueryClient)=>
    createBrowserRouter([
        {
            path :paths.home,
            lazy :()=>import('./routes/Home/Home').then(convert(queryClient)),
            HydrateFallback: () => <div className="h-screen w-screen flex items-center justify-center">
                <Spinner size="xl"/>
            </div>
        },
    ])
export const AppRouter= () =>{
    const queryClient = useQueryClient();
    const router: any = useMemo(()=> createAppRouter(queryClient),[queryClient]);
    return <RouterProvider router={router}/>;
}