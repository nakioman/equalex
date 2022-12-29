import { ReactElement } from "react";
import DashboardLayout from "../layout/dashboard";

export default function SecurityPage() {
    return (
        <div>hola</div>
    )
}

SecurityPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};