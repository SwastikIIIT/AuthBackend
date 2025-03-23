// "use client";
// import dynamic from 'next/dynamic';
// import React from "react";

// // Dynamically import the content component with ssr disabled
// const ResetPasswordContent = dynamic(
//   () => import('./ResetPasswordContent'),
//   { 
//     ssr: false,
//     loading: () => <div>Loading...</div>
//   }
// );

// const ResetPasswordPage = () => {
//   return <ResetPasswordContent />;
// };

// export default ResetPasswordPage;