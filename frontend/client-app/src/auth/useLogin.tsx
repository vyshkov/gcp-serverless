import React, { useEffect, useMemo, useState } from "react";


const googleSignInScriptURL: string = "https://accounts.google.com/gsi/client";

declare global {
  interface Window {
    google: any;
    [key: string]: any;
  }
}

export default function useScript(src: string): string {
    // Keep track of script status ("idle", "loading", "ready", "error")
    const [status, setStatus] = useState<string>(src ? "loading" : "idle");
  
    useEffect(
      () => {
        // Allow falsy src value if waiting on other data needed for
        // constructing the script URL passed to this hook.
        if (!src) {
          setStatus("idle");
          return;
        }
  
        // Fetch existing script element by src
        // It may have been added by another intance of this hook
        let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);
  
        if (!script) {
          // Create script
          script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.setAttribute("data-status", "loading");
          // Add script to document body
          document.body.appendChild(script);
  
          // Store status in attribute on script
          // This can be read by other instances of this hook
          const setAttributeFromEvent = (event: Event) => {
            !!script && script.setAttribute("data-status", event.type === "load" ? "ready" : "error");
          };
  
          script.addEventListener("load", setAttributeFromEvent);
          script.addEventListener("error", setAttributeFromEvent);
        } else {
          // Grab existing script status from attribute and set to state.
          setStatus(script.getAttribute("data-status") || "idle");
        }
  
        // Script event handler to update status in state
        // Note: Even if the script already exists we still need to add
        // event handlers to update the state for *this* hook instance.
        const setStateFromEvent = (event: Event) => {
          setStatus(event.type === "load" ? "ready" : "error");
        };
  
        // Add event listeners
        script.addEventListener("load", setStateFromEvent);
        script.addEventListener("error", setStateFromEvent);
  
        // Remove event listeners on cleanup
        return () => {
          if (script) {
            script.removeEventListener("load", setStateFromEvent);
            script.removeEventListener("error", setStateFromEvent);
          }
        };
      },
      [src] // Only re-run effect if script src changes
    );
  
    return status;
  }

// Further information -> https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  callback?: (response: CredentialResponse) => any;
  native_callback?: (response: CredentialResponse) => any;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  allowed_parent_origin?: string;
  intermediate_iframe_close_callback?: string;
}

interface UseGoogleOneTapLoginProps extends IdConfiguration {
  disabled?: boolean;
}

interface CredentialResponse {
  credential: string;
  select_by: string;
  client_id: string;
}

export const useGoogleOneTapLogin = (configuration: UseGoogleOneTapLoginProps) => {
  const script = useScript(googleSignInScriptURL);

  useEffect(() => {
    if (script === "ready" && !configuration.disabled) {
      window.google.accounts.id.initialize({ ...configuration });
      window.google.accounts.id.prompt();
    }
  }, [configuration, script]);

  return () => window.google.accounts.id.prompt();
};

interface AuthContextData {
  login: () => void;
  userData?: {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    alg: string;
    kid: string;
  };
  token: string | null | undefined;
  isLogged: boolean;
}

const AuthContext = React.createContext<AuthContextData>({ login: () => {}, token: null, userData: undefined, isLogged: false });

interface AuthProviderProps {
  children: React.ReactNode;
}

const CLIENT_ID = "397907536090-h8dln0rh8picm5vvk1qkeu0qhvkgek49.apps.googleusercontent.com";

interface JWT {
  header?: {
    alg: string;
    typ: string;
  };
  payload?: {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    alg: string;
    kid: string;
  };
}

function parseJwt (token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [token, setToken] = useState<string | undefined | null>(localStorage.getItem("credential"));

  const login = useGoogleOneTapLogin({
    client_id: CLIENT_ID,
    disabled: Boolean(token),
    callback: ({ credential }) => {
      console.log('credential', credential);
      setToken(credential);
      localStorage.setItem('credential', credential);
    }
  });

  const memoizedProps = useMemo(
      () => ({ login, userData: (token && parseJwt(token)) || {}, token, isLogged: !!token }), [login, token]
  );
  return (
    <AuthContext.Provider value={memoizedProps}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};