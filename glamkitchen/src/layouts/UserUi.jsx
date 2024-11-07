import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

export default function UserUi() {
    return (
        <div>
            <Navbar />
            <div>
                <Outlet />
            </div>
        </div>
    )
}