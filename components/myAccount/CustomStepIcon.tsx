// import React from "react";
// import { StepIconProps } from "@mui/material/StepIcon";

// const CustomStepIcon: React.FC<StepIconProps> = (props) => {
//   const { active = false, completed = false, className, icon } = props;

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: completed
//           ? "#4caf50" // Green color for completed steps
//           : active
//           ? "#4caf50" // Green color for the active step
//           : "#e0e0e0", // Gray color for inactive steps
//         color: completed || active ? "white" : "#4caf50",
//         border: completed || active ? "none" : "2px dashed #4caf50",
//         borderRadius: "50%",
//         width: "32px",
//         height: "32px",
//         fontWeight: "bold",
//       }}
//       className={className}
//     >
//       {completed ? "✔" : icon}
//     </div>
//   );
// };

// export default CustomStepIcon;
