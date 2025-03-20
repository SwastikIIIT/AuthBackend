
const handleVerify2FA =async(formData) => {
    const code=formData.get("token");
    const secret=formData.get("secret");
    if(!code || code.length<6)
        throw Error("Please enter a valid 6-digit code");

    try{
           const data=await fetch("/api/auth/verify-2a",{
             method:"POST",
             headers:{"Content-type":"application/json"},
             body:JSON.stringify({
                token:code,
                secret:secret
             })
           })
           const response=await data.json();

           if(response.success)
           {
                 return {success:true,message:response.message};
           }
           else
           { 
                 return {success:false,message:response.message};
           }   
    }
    catch(err)
    {
            return {success:false,message:"Could not connect to server"};
    }
}

export default handleVerify2FA