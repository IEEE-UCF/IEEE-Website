"use client";
//pls deploy
// import { TRPCClientError } from "@trpc/client";
// import { AppRouter } from "@/lib/trpc/root";

import { majorEnums } from "@/lib/database/schema";

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  // please deploy
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";

export default function RegisterPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [major, setMajor] = useState("");

  const completeRegistration = trpc.member.completeRegistration.useMutation({
    onSuccess: () => {
      window.location.href =("/");
    },
    onError: (err) => {
      console.error("Registration error:", err);
      setError(err.message || "Failed to complete registration");
      setIsSubmitting(false);
    }
    
  });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") return;

    if (status === "authenticated") {
      update();

      if(session?.user?.memberId) {
        router.push("/dashboard");

      }
    }
  }, [status, session, router]);

  const handleDiscordSignIn = useCallback(async() => {
    await signIn("discord", { 
      callbackUrl: "/auth/register",
      redirect: true 
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) =>  {
    e.preventDefault();
    
    if (!session?.user) {
      setError("Please sign in with Discord first");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const dobMonth = formData.get("dob_month") as string;
    const dobDay = formData.get("dob_day") as string;
    const dobYear = formData.get("dob_year") as string;
    const dateOfBirth = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

    try {
      await completeRegistration.mutateAsync({
        firstName: formData.get("first_name") as string,
        middleName: formData.get("middle_name") as string || undefined,
        lastName: formData.get("last_name") as string,
        ucfEmail: formData.get("ucf_email") as string,
        personalEmail: formData.get("personal_email") as string,
        dateOfBirth,
        phoneNumber: formData.get("phone_num") as string || undefined,
        gender: formData.get("gender") as "M" | "F" | "NB" | "O" | "PNTS",
        graduationYear: parseInt(formData.get("ucf_grad_year") as string),
        major: formData.get("major") as (typeof majorEnums)["enumValues"][number],
      });
    } catch (err) {
      console.error("Registration error:", err);
      setIsSubmitting(false);
    }
 },  []);


  return (
    <div className="flex justify-center min-h-screen items-center bg-[var(--ieee-dark-grey)]">

       <div className="relative w-full max-w-lg p-5 lg:m-10 rounded-lg shadow-lg  bg-black sm:h-[90vh] justify-center border ">
        
        <div className="absolute inset-0  bg-black opacity-70 blur-3xl rounded-lg pointer-events-none"/>
        <div className="relative z-10 max-h-full overflow-y-auto">

      <form onSubmit={handleSubmit} className="flex flex-col relative z-10 h-1/2">
        <FieldGroup className="flex items-center justify-center place-content-center text-white h-1/2">
          <FieldSet>
            <div className="flex justify-center mb-4">
              <h1 className="text-4xl font-[heading-font] text-white">
                IEEE @ UCF
              </h1>
            </div>
            <div className="flex justify-center mb-6">
              <h2 className="text-white text-xl font-[body-italic-font]">
                Register to become a member of IEEE @ UCF!
              </h2>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {!session?.user ? (
              <div className="flex flex-col justify-center items-center">
                <div className="relative group cursor-pointer ">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] blur-md opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 rounded-md"></div>

                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleDiscordSignIn}
                    className="relative z-10 flex items-center justify-center gap-2 px-14 py-10 font-[heading-font] rounded-md text-white bg-[var(--ieee-dark-yellow)] border-none hover:scale-105 transition-transform hover:cursor-pointer "
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <div className="font-[heading-font] ">SIGN IN WITH DISCORD TO CONTINUE</div>
                  </Button>

                </div>
                <div className="p-2"></div>
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-[var(--ieee-dark-yellow)] rounded flex items-center">
                  {session.user.image && (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <div className="font-semibold">Connected as {session.user.name}</div>
                    <div className="text-sm">{session.user.email}</div>
                  </div>
                </div>

                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="first_name">
                      First Name
                    </FieldLabel>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Jane"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="middle_name">
                      Middle Name
                    </FieldLabel>
                    <Input
                      id="middle_name"
                      name="middle_name"
                      placeholder="Dunny"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="last_name">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Doe"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="ucf_email">
                      UCF Email
                    </FieldLabel>
                    <Input
                      id="ucf_email"
                      name="ucf_email"
                      type="email"
                      placeholder="ja123456@ucf.edu"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="personal_email">
                      Personal Email
                    </FieldLabel>
                    <Input
                      id="personal_email"
                      name="personal_email"
                      type="email"
                      placeholder="jane.doe@gmail.com"
                      required
                    />
                  </Field>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3 underline underline-offset-4">
                      Date of Birth
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Field>
                        <FieldLabel htmlFor="dob_month">
                          Month
                        </FieldLabel>
                        <Input 
                          id="dob_month" 
                          name="dob_month"
                          placeholder="MM" 
                          required
                          min="1"
                          max="12"
                          type="number"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="dob_day">
                          Day
                        </FieldLabel>
                        <Input 
                          id="dob_day" 
                          name="dob_day"
                          placeholder="DD" 
                          required
                          min="1"
                          max="31"
                          type="number"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="dob_year">
                          Year
                        </FieldLabel>
                        <Input 
                          id="dob_year" 
                          name="dob_year"
                          placeholder="YYYY" 
                          required
                          min="1950"
                          max="2010"
                          type="number"
                        />
                      </Field>
                    </div>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="phone_num">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="phone_num"
                      name="phone_num"
                      type="tel"
                      placeholder="(407) 123-4567"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="gender">
                      Gender
                    </FieldLabel>
                    <Select name="gender" required>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="NB">Non-Binary</SelectItem>
                        <SelectItem value="O">Other</SelectItem>
                        <SelectItem value="PNTS">Prefer Not To Say</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="ucf_grad_year">
                      Graduation Year
                    </FieldLabel>
                    <Input
                      id="ucf_grad_year"
                      name="ucf_grad_year"
                      type="number"
                      placeholder="2027"
                      required
                      min="2024"
                      max="2035"
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel htmlFor="major">
                      Major
                    </FieldLabel>
                    <Select name="major" value={major} onValueChange={setMajor} required>
                      <SelectTrigger id="major">
                        <SelectValue placeholder="Select major" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {majorEnums.enumValues.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <div className="flex gap-4 mt-6">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[var(--ieee-dark-yellow)] hover:bg-[var(--ieee-bright-yellow)] hover:scale-105 cursor-pointer transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                  <Button 
                    type="button"
                    className="flex-1 cursor-pointer bg-[var(--ieee-dark-grey)]  hover:scale-105 hover:opacity-80 transition-all"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
    </div>
        </div>

  );
}