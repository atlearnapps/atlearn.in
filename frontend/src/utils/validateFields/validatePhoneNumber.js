export default  function validatePhoneNumber(phone){
    const phoneRegex = /^[0-9]{10}$/; // This regex checks for exactly 10 digits
    return phoneRegex.test(phone);
}