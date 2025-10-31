import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Monitor() {
    const navigate = useNavigate();
    useEffect(()=>{
        window.open("https://grafana.atlearn.in:3002/"); 
        navigate("/organization/dashboard")

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
    <div>
      
    </div>
  )
}

export default Monitor
