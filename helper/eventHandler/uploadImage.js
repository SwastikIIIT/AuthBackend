const uploadImage = async (formData) => {
    try
    {
      const response=await fetch('/api/user/update-avatar', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        return {
          success: false,
          message: `Server error: ${response.status} ${response.statusText}`
        };
      }
      
      const data=await response.json();
      return data;
    }
    catch(error) 
    {
      console.error('Error in uploadImage:', error);
      return {success:false,message: error.message};
    }
  };
  
  export default uploadImage;