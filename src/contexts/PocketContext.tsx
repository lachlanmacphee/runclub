import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
  useState,
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
    requestVolunteer: boolean,
    alias?: string
  ) => Promise<RecordModel>;
  login: (
    email: string,
    password: string
  ) => Promise<RecordAuthResponse<RecordModel>>;
  OAuthLogin: (provider: string) => Promise<RecordAuthResponse<RecordModel>>;
  resetPassword: (email: string) => Promise<void>;
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
  pb.autoCancellation(false);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState<User>(pb.authStore.model as User);

  useEffect(() => {
    async function getLatestUserData() {
      const res = await pb.collection("users").authRefresh();
      setToken(res.token);
      setUser(res.record as User);
    }
    if (pb.authStore.isValid) {
      getLatestUserData();
    }
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model as User);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirm: string,
      requestVolunteer: boolean,
      alias?: string
    ) => {
      const res = (await pb.collection("users").create({
        name,
        alias,
        email,
        password,
        passwordConfirm,
        role: "member",
      })) as User;
      if (requestVolunteer) {
        await pb
          .collection("role_requests")
          .create({ user_id: res.id, new_role: "moderator" });
      }
      return res;
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
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider });

      const meta = authData.meta;

      if (meta?.isNew) {
        const formData = new FormData();
        formData.append("name", meta.name);
        formData.append("role", "member");
        await pb.collection("users").update(authData.record.id, formData);
      }

      return authData;
    },
    [pb]
  );

  const resetPassword = useCallback(
    async (email: string) => {
      await pb.collection("users").requestPasswordReset(email);
    },
    [pb]
  );

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, [pb]);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) {
      logout();
      return;
    }
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      return;
    }
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = tokenExpiration + fiveMinutesInMs / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [logout, pb, token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <PocketContext.Provider
      value={{
        register,
        login,
        OAuthLogin,
        resetPassword,
        logout,
        user,
        token,
        pb,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};
