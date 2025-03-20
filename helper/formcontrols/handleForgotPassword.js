
const handleForgotPassword =async(formData) => {
    const email=formData.get("email");

    try
    {
        const data=await fetch("/api/auth/forgot-password",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                email:email
            })
        })

        const response=await data.json();

        if(response.success)
        {
            return {success:true,message:"Reset link sent.Check your email"};
        }
        else
        {
            return {success:false,message:response.message || "Something went wrong"};
        }
     }
     catch(err)
     {
        throw Error(err.message);
     } 
}

export default handleForgotPassword;