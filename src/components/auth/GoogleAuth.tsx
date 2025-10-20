import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '../../utils';

async function sha256(input: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    return await crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(arrayBuffer: ArrayBuffer): string {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => ('0' + b.toString(16)).slice(-2)).join('');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
    const hashed = await sha256(verifier);
    return base64UrlEncode(hashed);
}

const GoogleAuth: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const handleGoogleLogin = async () => {
        try {
            const clientId = GOOGLE_CLIENT_ID;
            const redirectUri = GOOGLE_REDIRECT_URI;
            if (!clientId) {
                console.error('Google Client ID is not configured');
                alert('Google Client ID is not configured. Please check your environment variables.');
                return;
            }

            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            sessionStorage.setItem('pkce_code_verifier', codeVerifier);

            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${clientId}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=code&` +
                `scope=openid%20email%20profile%20https://www.googleapis.com/auth/youtube.readonly%20https://www.googleapis.com/auth/youtube.upload&` +
                `access_type=offline&` +
                `prompt=consent&` +
                `state=${encodeURIComponent(window.location.pathname)}&` +
                `code_challenge=${codeChallenge}&` +
                `code_challenge_method=S256`;

            window.location.href = googleAuthUrl;

        } catch (error) {
            console.error('Google login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_refresh_token');
    };

    if (isAuthenticated && user) {
        return (
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                    <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white text-sm font-medium">{user.name}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-youtube-lightGray text-white px-3 py-1.5 rounded-full hover:bg-youtube-gray transition-colors text-sm"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleGoogleLogin}
                className="flex items-center space-x-2 bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <span className="font-medium">Sign in with Google</span>
            </button>
        </div>
    );
};

export default GoogleAuth;