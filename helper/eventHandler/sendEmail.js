const sendEmail=async()=>{

    try{
          const data=await fetch("/api/auth/send-email-for-verification");
          const  result=await data.json();

          if(result.success)
          {
             return {success:true,message:result.message};
          }
          else
          {
            return {success:false,message:result.message}
          }
    }
    catch(err)
    {
        return {success:false,message:err.message}
    }
  
}

export default sendEmail;