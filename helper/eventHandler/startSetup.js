
const startSetup =async() => {
   try
   {
        const data=await fetch("/api/auth/setup-2a");
        const response=await data.json();

        if(response?.success)
        {
             return{success:true,secret:response.secret,qr:response.qr}
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

export default startSetup