import { Layout } from "antd";
import Head from "next/head";
import { ReactNode } from "react";
import Footer from "./footer";
import Sidebar from "./sidebar";


type DashboardLayout = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayout) {
    const { Content, Header } = Layout;

    return (
        <>
            <Head>
                <title>Equalex</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout>
                    <Header>Header</Header>
                    <Content>{children}</Content>
                    <Footer />
                </Layout>
            </Layout>
        </>
    );
}