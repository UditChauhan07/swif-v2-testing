export const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      boxShadow: "none", // Removes focus outline
      border: "1px solid lightgrey", // Sets border color to grey
      backgroundColor: "white", // Keeps default background
      color: "black", // Default text color
      "&:hover": { border: "1px solid lightgrey" }, // Ensures consistent border on hover
    }),
  
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#5c5c63" : isFocused ? "#9a9aa0" : "white",
      color: isSelected || isFocused ? "white" : "black", // Ensures good contrast
      "&:hover": { backgroundColor: "#9a9aa0" },
    }),
  };
  