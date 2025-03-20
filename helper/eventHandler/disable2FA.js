
const disable2FA = async() => {
    
    try
    {
           const data=await fetch("/api/auth/disable-2a",{
            method:"POST",
            headers:{"Content-type":"application/json"}
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

export default disable2FA