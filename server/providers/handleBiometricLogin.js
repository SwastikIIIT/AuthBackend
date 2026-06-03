'use server'
import { signIn } from "@/auth";

export const handleBiometric = async(authResp,email) => {
 try{
    const verificationResp = await signIn("credentials", {
            biometricData: JSON.stringify(authResp),
            email: email,
            isBiometric: "true",
            redirect: false,
    });
    console.log(verificationResp);
    return true;
 }
 catch(err)
 {
    console.error(err);
    return false;
 }
}
