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
import { ROLES } from "@/lib/constants";

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
  confirmResetPassword: (
    token: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>;
  requestEmailChange: (newEmail: string) => Promise<void>;
  confirmEmailChange: (token: string, password: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  confirmVerification: (token: string) => Promise<void>;
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
      try {
        const res = await pb.collection("users").authRefresh();
        setToken(res.token);
        setUser(res.record as User);
      } catch (error) {
        pb.authStore.clear();
      }
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
          .create({ user_id: res.id, new_role: ROLES.MODERATOR });
      }
      // Users must verify their email before they can log in
      await pb.collection("users").requestVerification(email);
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
      const w = window.open() as Window;

      const authData = await pb.collection("users").authWithOAuth2({
        provider,
        urlCallback: (url) => {
          w.location.href = url;
        },
      });

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

  const confirmResetPassword = useCallback(
    async (token: string, password: string, passwordConfirm: string) => {
      await pb
        .collection("users")
        .confirmPasswordReset(token, password, passwordConfirm);
    },
    [pb]
  );

  const requestEmailChange = useCallback(
    async (newEmail: string) => {
      await pb.collection("users").requestEmailChange(newEmail);
    },
    [pb]
  );

  const confirmEmailChange = useCallback(
    async (token: string, password: string) => {
      await pb.collection("users").confirmEmailChange(token, password);
      // The server invalidates existing sessions once the email changes
      pb.authStore.clear();
    },
    [pb]
  );

  const resendVerification = useCallback(
    async (email: string) => {
      await pb.collection("users").requestVerification(email);
    },
    [pb]
  );

  const confirmVerification = useCallback(
    async (token: string) => {
      await pb.collection("users").confirmVerification(token);
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
    const currentTime = Date.now() / 1000;
    const timeUntilExpiration = tokenExpiration - currentTime;

    if (timeUntilExpiration < fiveMinutesInMs / 1000) {
      try {
        await pb.collection("users").authRefresh();
      } catch (error) {
        logout();
      }
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
        confirmResetPassword,
        requestEmailChange,
        confirmEmailChange,
        resendVerification,
        confirmVerification,
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
