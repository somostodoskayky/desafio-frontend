import { GOOGLE_CLIENT_ID } from "../utils";

export class OAuthService {
  private static instance: OAuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  public static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem("google_access_token");
    this.refreshToken = localStorage.getItem("google_refresh_token");
  }

  public reloadTokensFromStorage(): void {
    this.loadTokensFromStorage();
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken || null;

    localStorage.setItem("google_access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("google_refresh_token", refreshToken);
    }
  }

  public clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_refresh_token");
  }

  public async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const clientId = GOOGLE_CLIENT_ID;

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          refresh_token: this.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (response.ok) {
        const tokenData = await response.json();
        this.setTokens(tokenData.access_token, this.refreshToken);
        return tokenData.access_token;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return null;
  }

  public async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let token = this.accessToken;
    if (!token) {
      token = await this.refreshAccessToken();
    }

    if (!token) {
      throw new Error("No valid access token available");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });
    if (response.status === 401) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    }

    return response;
  }
}

export const oauthService = OAuthService.getInstance();
