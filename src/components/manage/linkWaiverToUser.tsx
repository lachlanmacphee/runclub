import { useMembers } from "@/hooks/useMembers";
import { useUsers } from "@/hooks/useUsers";

import Select from "react-select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePocket } from "@/contexts";
import { useToast } from "../ui/use-toast";
import { Waiver } from "@/lib/types";

export function LinkWaiverToUser() {
  const { pb } = usePocket();
  const { toast } = useToast();

  const { members } = useMembers();
  const { users } = useUsers();

  const [selectedMember, setSelectedMember] = useState<{
    label: string;
    value: string;
  } | null>();

  const [selectedUser, setSelectedUser] = useState<{
    label: string;
    value: string;
  } | null>();

  const handleLinkClick = async () => {
    if (!selectedMember || !selectedUser) {
      toast({
        title: "Invalid Parameters",
        description: "There needs to be both a waiver and user selected.",
        variant: "destructive",
      });
      return;
    }

    const existingWaiver: Waiver = await pb
      .collection("waivers")
      .getOne(selectedMember.value);
    if (existingWaiver?.user_id) {
      toast({
        title: "User Already Associated",
        description:
          "Failed to link as the waiver already has a user associated with it.",
        variant: "destructive",
      });
      setSelectedMember(null);
      setSelectedUser(null);
      return;
    }

    try {
      await pb
        .collection("waivers")
        .update(selectedMember.value, { user_id: selectedUser.value });
    } catch {
      toast({
        title: "Link Failed",
        description: "There was an error linking the waiver to the user.",
        variant: "destructive",
      });
      setSelectedMember(null);
      setSelectedUser(null);
      return;
    }

    toast({
      title: "Link Successful",
      description: "The waiver was successfully linked to the user.",
    });
    setSelectedMember(null);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl">Link Waiver to User</h2>
      <Select
        className="custom-react-select-container"
        classNamePrefix="custom-react-select"
        placeholder="Select waiver..."
        value={selectedMember}
        onChange={setSelectedMember}
        options={members.map((member) => {
          return {
            label: member.name,
            value: member.waiver_id,
          };
        })}
      />
      <Select
        className="custom-react-select-container"
        classNamePrefix="custom-react-select"
        placeholder="Select user..."
        value={selectedUser}
        onChange={setSelectedUser}
        options={users.map((user) => {
          return {
            label: user.name,
            value: user.id,
          };
        })}
      />
      <Button
        type="button"
        disabled={!selectedMember || !selectedUser}
        onClick={handleLinkClick}
        className="max-w-sm"
      >
        Link
      </Button>
    </div>
  );
}
