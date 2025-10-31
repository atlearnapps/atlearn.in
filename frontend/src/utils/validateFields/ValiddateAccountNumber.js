export const validateAccountNumber=(accountnumber)=>{
    const accountNumberRegex = /^[0-9]{9,18}$/;
    return accountNumberRegex.test(accountnumber);
}