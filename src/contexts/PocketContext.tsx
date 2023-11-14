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

const BASE_URL = "http://127.0.0.1:8090";
const fiveMinutesInMs = 300000;
const twoMinutesInMs = 120000;

export type PocketContextType = {
  register: (
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<RecordModel>;
  login: (
    email: string,
    password: string
  ) => Promise<RecordAuthResponse<RecordModel>>;
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
  const pb = useMemo(() => new PocketBase(BASE_URL), []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState<User>(pb.authStore.model as User);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model as User);
    });
  });

  const register = useCallback(
    async (email: string, password: string, passwordConfirm: string) => {
      return await pb
        .collection("users")
        .create({ email, password, passwordConfirm });
    },
    [pb]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      return await pb.collection("users").authWithPassword(email, password);
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
      value={{ register, login, logout, user, token, pb }}
    >
      {children}
    </PocketContext.Provider>
  );
};
