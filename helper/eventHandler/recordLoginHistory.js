
const recordLoginHistory =async(user,ip,success)=>{

    if(!user.loginHistory)
        user.loginHistory=[];
    
    if(user.loginHistory.length>=10)
        user.loginHistory.shift();

    user.loginHistory.push({
        ipAddress:ip.toString(),
        success:success,
        timestamp:new Date()
    })

    console.log(ip.toString());
    await user.save();
  
}

export default recordLoginHistory