const handleCodeCheck =async(formData) => {
    const code=formData.get('code');
    try{
           const data=await fetch("/api/auth/verify-email",{
            method:'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
                code:code
            })
           });
           const result=await data.json();

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

export default handleCodeCheck