import React from "react";
import { Outlet } from "react-router-dom";

export function Component() {
    return <>
        <h1>recover</h1>
        <Outlet />
    </>
}