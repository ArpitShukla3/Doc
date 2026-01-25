import { SidebarProvider } from "@components/ui/elements/sidebar";
import Navigation from "./Navigation";
import { AppSidebar } from "@components/ui/elements/app-sidebar";
import Page from "./Page";

export default function Home() {
    return (
        <>
            <SidebarProvider>
                <div className=" w-screen flex bg-background">
                    <AppSidebar />
                    <Navigation />
                    <Page />
                </div>
            </SidebarProvider>
        </>
    );
}