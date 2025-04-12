import { useCallback, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePocket } from "@/contexts";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { WAIVER_PARAGRAPHS } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { WaiverFormSchema } from "@/lib/schemas";
import { PhoneInput } from "@/components/ui/phone-input";

export const Waiver = () => {
  const { pb } = usePocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof WaiverFormSchema>>({
    resolver: zodResolver(WaiverFormSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      fname: "",
      lname: "",
      alias: "",
      suburb: "",
      postcode: "",
      phone: "",
      gender: "Blank",
      age: "Blank",
      satisfiesAgeReq: "Over18",
      readTermsAndConditions: false,
      emergencyContactName: "",
      emergencyContactPhone: "",
      referredBy: "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState, form.reset]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof WaiverFormSchema>) => {
      try {
        await pb.collection("waivers").create(data);
        toast({
          title: "Waiver submitted!",
          duration: 5000,
          description:
            "You're all ready to go! If you haven't already, you can create an account to access other great features.",
        });
        navigate("/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.data?.data?.email?.code == "validation_not_unique") {
          toast({
            title: "Duplicate waiver",
            variant: "destructive",
            duration: 5000,
            description:
              "We already have a waiver in the system with that email address.",
          });
          return;
        }

        toast({
          title: "Waiver failed to submit.",
          variant: "destructive",
          duration: 5000,
          description:
            "Please contact us through Facebook or WhatsApp to resolve this issue.",
        });
      }
    },
    [navigate, pb, toast]
  );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 grow max-w-3xl">
        <h1 className="text-5xl font-bold">Gunn Runners - Waiver Form</h1>
        {WAIVER_PARAGRAPHS.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="fname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Smith"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Alias (optional - please use this only if you have to)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John S" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.smith@gmail.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suburb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suburb</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="South Melbourne"
                      autoComplete="address-level2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="3205"
                      autoComplete="postal-code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput defaultCountry="AU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Blank" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Prefer not to say
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Under18" />
                        </FormControl>
                        <FormLabel className="font-normal">Under 18</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="18-30" />
                        </FormControl>
                        <FormLabel className="font-normal">18 - 30</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="31-40" />
                        </FormControl>
                        <FormLabel className="font-normal">31 - 40</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="41-50" />
                        </FormControl>
                        <FormLabel className="font-normal">41 - 50</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Above50" />
                        </FormControl>
                        <FormLabel className="font-normal">Above 50</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Blank" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Prefer not to say
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satisfiesAgeReq"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Confirming I am over 18, or I have my parent's / guardian's
                    permission to run
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Over18" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I'm over 18
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="HavePermission" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I've got permission (under 18 only)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">
                    Emergency Contact Phone Number
                  </FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput defaultCountry="AU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referredBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where did you hear about Gunn Runners?</FormLabel>
                  <FormControl>
                    <Input placeholder="Your answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="readTermsAndConditions"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I've read the terms and conditions above and agree to
                        them.
                      </FormLabel>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
