const fetchUserInfo=async()=>{
      try{
           const data=await fetch("/api/auth/user-info");
           const response=await data.json();
           if(response.success)
           {
                return {success:true,userData:response.user,message:response.message};
           }
           else
           {
                return {success:false,message:response.message};
           }
      }
      catch(err)
      {
           console.log(err); 
           return {success:false,message:"Could not load User Info from database"}
      }
}

export default fetchUserInfo