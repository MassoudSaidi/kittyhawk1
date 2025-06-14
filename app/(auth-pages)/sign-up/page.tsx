import { ValidatedSignupForm } from "@/components/ValidatedSignupForm";
import { FormMessage, Message } from "@/components/form-message";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: { searchParams: Promise<Record<string, string>>  }) {
  
  const searchParams = await props.searchParams;
  const message = searchParams.error 
    ? { message: searchParams.error, type: 'error' as const }
    : searchParams.success
    ? { message: searchParams.success, type: 'success' as const }
    : { message: searchParams.info, type: 'info' as const };




  return (
    <>
      <ValidatedSignupForm message={{ message: '' }} />
      <div className="flex flex-col min-w-64 max-w-md mx-auto px-4">
        {message && <FormMessage message={message} />}
      </div>
      {/* <SmtpMessage /> */}
    </>  
  )  
}
