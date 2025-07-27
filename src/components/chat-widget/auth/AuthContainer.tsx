'use client';

import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

export const AuthContainer = () => {
    const [authType, setAuthType] = useState('Login');

    function renderAuthType() {

        if (authType === 'Login') {
            return <Login showSignup={() => setAuthType('Signup')} />;
        }

        return <Signup showLogin={() => setAuthType('Login')} />;
    }

    return (
        <div className='h-full w-full flex flex-col items-center justify-center'>
            {renderAuthType()}
        </div>
    );
}; 