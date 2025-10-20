import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { oauthService } from '../services/oauthService';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_SECRET } from '../utils';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = React.useState(false);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            if (isProcessing) return;
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            const state = urlParams.get('state');

            if (error) {
                console.error('OAuth error:', error);
                navigate('/?error=oauth_error');
                return;
            }

            if (code) {
                setIsProcessing(true);
                try {
                    await exchangeCodeForToken(code);
                    const redirectPath = state ? decodeURIComponent(state) : '/';
                    navigate(redirectPath);
                } catch (error) {
                    console.error('Authentication failed:', error);
                    navigate('/?error=auth_failed');
                } finally {
                    setIsProcessing(false);
                }
            } else {
                navigate('/');
            }
        };

        handleOAuthCallback();
    }, [navigate, dispatch, isProcessing]);

    const exchangeCodeForToken = async (code: string) => {
        const clientId = GOOGLE_CLIENT_ID;
        const clientSecret = GOOGLE_CLIENT_SECRET;
        const redirectUri = GOOGLE_REDIRECT_URI;
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier') || '';

        console.log('Exchanging code for token:', { clientId, redirectUri, hasCodeVerifier: !!codeVerifier, hasClientSecret: !!clientSecret });

        if (!codeVerifier) {
            throw new Error('Missing PKCE code verifier. Please try logging in again.');
        }

        if (!clientSecret) {
            throw new Error('Missing client secret. Please check your environment variables.');
        }
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Token exchange failed:', response.status, errorText);
            throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
        }

        const tokenData = await response.json();
        console.log('Token exchange successful');
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            console.error('User info fetch failed:', userResponse.status, errorText);
            throw new Error(`Failed to fetch user info: ${userResponse.status} ${errorText}`);
        }

        const userData = await userResponse.json();
        console.log('User info fetched successfully:', userData.email);

        dispatch(login({
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                picture: userData.picture,
            },
            accessToken: tokenData.access_token,
        }));
        oauthService.setTokens(tokenData.access_token, tokenData.refresh_token);
        sessionStorage.removeItem('pkce_code_verifier');
    };

    return (
        <div className="min-h-screen bg-youtube-dark flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <h2 className="text-white text-xl font-medium mb-2">Completing sign in...</h2>
                <p className="text-gray-400">Please wait while we complete your authentication.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
