import { auth } from "@/auth";
import LoginForm from "@/components/LoginForm"
import { redirect } from "next/navigation";


export default async function LoginPage() {

  const userSessionData=await auth();
  if(userSessionData?.user)
  redirect("/");

  return (
       <LoginForm/>
    );
}
