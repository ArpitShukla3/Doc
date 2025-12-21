import { Sidebar, SidebarProvider } from "@components/ui/elements/sidebar";
import Navigation from "./Navigation";
import { AppSidebar } from "@components/ui/elements/app-sidebar";

export default function Home() {
    return (
        <>
            <SidebarProvider>
                <div className=" w-screen flex bg-background">
                    <AppSidebar />
                    <Navigation />
                </div>
            </SidebarProvider>
        </>
    );
}