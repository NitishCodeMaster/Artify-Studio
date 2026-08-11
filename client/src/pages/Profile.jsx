import React from 'react';
import PublicProfile from './PublicProfile';

const Profile = () => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const myId = currentUser.id || currentUser._id || currentUser.userId;

    if (!myId) {
        return (
            <div className="min-h-screen bg-[#06060a] text-white flex items-center justify-center">
                <p className="text-sm text-white/50">Please log in to view your profile.</p>
            </div>
        );
    }

    return <PublicProfile overrideUserId={myId} />;
};

export default Profile;
