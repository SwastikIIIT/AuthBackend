

const handleResetPassword = async(formData) => {
    const newPass=formData.get("password");
    const confPass=formData.get("confirmpassword");
    const token=formData.get("token");

    if(newPass!==confPass)
        throw Error("Passwords don't match");

    try
    {
        const data=await fetch("/api/auth/reset-password",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                token:token,
                password:newPass
            })
        })

        const response=await data.json();

         if(response.success)
         {
            return {success:true,message:"You can now login with your new password"};
         }
         else
         {
            return {success:false,message:response.message};
         }
    }
    catch(err)
    {
       return err.message;
    }
 
}

export default handleResetPassword;