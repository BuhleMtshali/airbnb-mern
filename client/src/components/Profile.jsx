import { use, useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";

const Profile = () => {
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) subpage = 'profile';
    if(!ready){
        return 'Loading...';
    }
    if (ready && !user){
        return <Navigate to={'/login'} />
    }
    return(
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br/>
                    <button className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
        </div>
    )
}

export default Profile;