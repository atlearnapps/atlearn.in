export const validateIFCE=(code)=>{
    const ifscCodeRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    return ifscCodeRegex.test(code);
}