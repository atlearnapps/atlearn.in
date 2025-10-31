// export default function Switch(theme) {
//     return {
//       MuiSwitch: {
//         styleOverrides: {
//           root: {
//             '& .MuiSwitch-switchBase': {
//               color: '#E8063C', // Change the color of the switch thumb to red
//               '&.Mui-checked': {
//                 color: '#49cf1d', // Change the color of the switch thumb when checked to red
//               },
//               '&:hover': {
//                 backgroundColor: 'transparent', // Optional: Set background to transparent on hover
//               },
//             },
//             '& .MuiSwitch-track': {
//               backgroundColor: '#E8063C', // Change the color of the track to red
//             },
//           },
//         },
//       },
//     };
//   }
  

export default function Switch(theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            color: '#E8063C', // Color of the switch thumb when unchecked
            '&.Mui-checked': {
              color: '#49cf1d', // Color of the switch thumb when checked
              '& + .MuiSwitch-track': {
                backgroundColor: '#49cf1d', // Background color of the track when checked
              },
            },
            '&:hover': {
              backgroundColor: 'transparent', // Optional: Set background to transparent on hover
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#E8063C', // Background color of the track when unchecked
          },
        },
      },
    },
  };
}
