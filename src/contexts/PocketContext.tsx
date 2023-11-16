import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import PocketBase, { RecordAuthResponse, RecordModel } from "pocketbase";
import { useInterval } from "usehooks-ts";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { User } from "@/lib/types";

const fiveMinutesInMs = 300000;
const twoMinutesInMs = 120000;

export type PocketContextType = {
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
    role: string
  ) => Promise<RecordModel>;
  login: (
    email: string,
    password: string
  ) => Promise<RecordAuthResponse<RecordModel>>;
  OAuthLogin: (provider: string) => Promise<RecordAuthResponse<RecordModel>>;
  logout: VoidFunction;
  user: User | null;
  token: string;
  pb: PocketBase;
};

export const PocketContext = createContext<PocketContextType | null>(null);

type PocketProviderProps = {
  children: ReactNode;
};

export const PocketProvider = ({ children }: PocketProviderProps) => {
  const pb = useMemo(() => new PocketBase(import.meta.env.VITE_PB_URL), []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState<User>(pb.authStore.model as User);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model as User);
    });
  });

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirm: string,
      role: string
    ) => {
      return await pb
        .collection("users")
        .create({ name, email, password, passwordConfirm, role });
    },
    [pb]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      return await pb.collection("users").authWithPassword(email, password);
    },
    [pb]
  );

  const OAuthLogin = useCallback(
    async (provider: string) => {
      return await pb.collection("users").authWithOAuth2({ provider });
    },
    [pb]
  );

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, [pb]);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      return;
    }
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (tokenExpiration + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [pb, token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <PocketContext.Provider
      value={{ register, login, OAuthLogin, logout, user, token, pb }}
    >
      {children}
    </PocketContext.Provider>
  );
};
