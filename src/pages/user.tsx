import { AccountDetails } from "@/components/user/accountDetails";
import { RoleRequest } from "@/components/user/roleRequest";

export const Account = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-16 grow max-w-3xl">
        <AccountDetails />
        <RoleRequest />
      </div>
    </div>
  );
};
