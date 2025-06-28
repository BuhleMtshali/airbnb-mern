import { use, useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

const Profile = () => {
    const { ready, user, setUser } = useContext(UserContext);
    if(!ready){
        return 'Loading...';
    }
    if (ready && !user){
        return <Navigate to={'/login'} />
    }
    return(
        <div>Account page for {user.name}</div>
    )
}

export default Profile;