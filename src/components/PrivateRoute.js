import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({user, redirectPath = '/login'}) => {
    return user ? <Outlet/> : <Navigate to={redirectPath}/>
}

export default PrivateRoute