import { useCallback } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePocket } from "@/contexts";

// Components
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RoleRequestSchema } from "@/lib/schemas";
import { User } from "@/lib/types";

export const RoleRequest = () => {
  const pocket = usePocket();
  const pb = pocket.pb;
  const user = pocket.user as User;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof RoleRequestSchema>>({
    resolver: zodResolver(RoleRequestSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      role: user.role,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof RoleRequestSchema>) => {
      try {
        await pb
          .collection("role_requests")
          .create({ user_id: user.id, new_role: data.role });
        toast({
          title: "Role Requested",
          duration: 5000,
          description: `Your role will be adjusted as soon as an admin approves the request.`,
        });
      } catch {
        toast({
          title: "Role Request Failed.",
          variant: "destructive",
          duration: 5000,
          description:
            "Something went wrong. Please note you can only have one role change request at a time.",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pb, toast]
  );

  const newRole = form.watch("role");

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 grow max-w-3xl">
        <h1 className="text-5xl font-bold">Request Role Change</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="moderator">Volunteer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={user.role == newRole}>
              {user.role == newRole ? "Change your role first" : "Request"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
