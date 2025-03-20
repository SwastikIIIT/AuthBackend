import { auth } from "@/auth";
import LoginForm from "@/components/LoginForm"
import { handleSession } from "@/helper/formcontrols/handleCookieSession";
import { redirect } from "next/navigation";


export default  async function LoginPage() {

        const userSessionData=await auth();
        // console.log("Session form login page:",userSessionData);

  if(userSessionData?.user)
  redirect("/auth-backend");

  return (
       <LoginForm/>
    );
}
