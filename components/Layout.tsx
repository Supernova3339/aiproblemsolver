import {Component} from "react";
import {ThemeProvider} from "next-themes";
import { ModalProvider } from "@/components/providers/modal-provider";
import {Metadata} from "next";
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: 'AI Problem Solver',
    description: 'Solve simple problems with the help of AI',
}

class Layout extends Component<{
    children: any
}> {
    render() {
        let {children} = this.props;
        return (

            <div>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <nav />
                    <ModalProvider />
                    {children}
                    <Toaster />
                </ThemeProvider>
            </div>
        );
    }
}

export default Layout;